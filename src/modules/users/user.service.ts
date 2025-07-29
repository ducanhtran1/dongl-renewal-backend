import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkCaptcha } from 'src/common/utils/check-captcha.util';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { HashUtil } from '../../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async createWithProfile(userFields: any, profileFields: any) {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: userFields.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create(userFields);
    const savedUser = (await this.userRepository.save(user)) as unknown as User;
    const profile = this.profileRepository.create({
      ...profileFields,
      user_id: savedUser.user_id,
    });
    await this.profileRepository.save(profile);
    return savedUser;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });
    return {
      items: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneWithProfile(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { phone_number: phoneNumber },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async toggleActive(id: string) {
    const user = await this.findOne(id);
    user.is_active = !user.is_active;
    return this.userRepository.save(user);
  }

  async verifyAccount(forgotPasswordDto: ForgotPasswordDto): Promise<User> {
    try {
      // Verify the captcha
      // const captchaSecret = this.configService.get<string>('RECAPTCHA_SECRET');
      // if (!captchaSecret) {
      //   throw new BadRequestException('Captcha secret not found');
      // }
      // await checkCaptcha(forgotPasswordDto.captcha, captchaSecret);
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordDto.email.toLowerCase() },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to send verification email');
    }
  }

  async changePassword({ email, password }: { email: string; password: string }): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    try {
      existingUser.password_hash = await HashUtil.hash(password);
      await this.userRepository.save(existingUser);
      return 'User updated successfully';
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }

  // async findBySocial(provider: string, socialId: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { social_accounts: { provider, social_id: socialId } },
  //   });
  //   return user;
  // }

  // async createSocialUser(userFields: any, socialFields: any) {
  //   const user = this.userRepository.create(userFields);
  //   const savedUser = (await this.userRepository.save(user)) as unknown as User;
  //   const social = this.socialRepository.create({
  //     ...socialFields,
  //     user_id: savedUser.user_id,
  //   });
  //   await this.socialRepository.save(social);
  //   return savedUser;
  // }
}
