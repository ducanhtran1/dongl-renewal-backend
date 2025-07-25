import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Put,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from './enums/user-role.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import * as dayjs from 'dayjs';
import { VerificationToken } from './entities/verification-tokens.entity';
import { VerificationTokenRepository } from './repositories/verification-tokens.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly verificationTokenRepository: VerificationTokenRepository,
  ) {}

  @UseGuards(RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.findAll(page, limit);
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiResponse({ status: 200, description: 'User status toggled successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleActive(id);
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60 } })
  @ApiOperation({ summary: 'Verify user email for password reset' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<string> {
    const user = await this.usersService.verifyAccount(forgotPasswordDto);
    const payload = { email: user.email, type: 'reset-password' };
    const token = await this.authService.signJwtToken(payload, '5m');

    const expired = dayjs().add(5, 'minute').toDate();
    const verificationToken: Partial<VerificationToken> = {
      user,
      token,
      expiresAt: expired,
    };
    await this.verificationTokenRepository.createOrUpdateVerificationToken(verificationToken);

    const url = `${this.configService.get('FE_URL')}/reset-password?token=${token}`;
    // Send email with token
    await this.mailService.sendPasswordResetEmail(user.email, url);
    return 'Email sent successfully';
  }

  @Public()
  @ApiOperation({ summary: 'Change user password' })
  @Put('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60 } })
  async resetPassword(@Headers('token') token: string, @Body() changePasswordDto: ChangePasswordDto): Promise<string> {
    // Verify the provided token
    const decodedToken = await this.authService.verifyToken(token);
    if (decodedToken.type !== 'reset-password') {
      throw new BadRequestException('Invalid token type');
    }
    const verificationToken = await this.verificationTokenRepository.findByToken(token);
    if (!verificationToken || verificationToken.token !== token) {
      throw new BadRequestException('Your Token is invalid');
    }
    if (!verificationToken.expiresAt || dayjs(verificationToken.expiresAt).isBefore(dayjs())) {
      throw new BadRequestException('Your Token has expired');
    }
    // Change the user's password
    await this.usersService.changePassword({
      email: decodedToken.email,
      password: changePasswordDto.new_password,
    });
    await this.mailService.sendPasswordChangedNotification(decodedToken.email);
    await this.verificationTokenRepository.clearVerificationToken(token);
    return 'Password reset successfully';
  }
}
