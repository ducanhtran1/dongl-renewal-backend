import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('kakao/callback')
  @Public()
  @ApiOperation({ summary: 'Kakao callback' })
  @ApiResponse({ status: 200, description: 'Kakao callback' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async kakaoCallback(@Query('code') code: string): Promise<any> {
    return await this.authService.loginWithKakao(code);
  }

  @Get('naver/callback')
  @Public()
  @ApiOperation({ summary: 'Naver callback' })
  async naverCallback(@Query('code') code: string, @Query('state') state: string) {
    return await this.authService.loginWithNaver(code, state);
  }

  @Get('apple/callback')
  @Public()
  @ApiOperation({ summary: 'Apple callback (GET)' })
  async appleCallbackGet(@Query('code') code: string) {
    return await this.authService.loginWithApple(code);
  }

  @Post('apple/callback')
  @Public()
  @ApiOperation({ summary: 'Apple callback' })
  async appleCallback(@Body() body: any) {
    return await this.authService.loginWithApple(body.code);
  }
}
