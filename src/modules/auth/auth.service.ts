import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<User> {
    const user = await this.usersService.findByPhoneNumber(phoneNumber);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      if (!user.is_active) {
        throw new UnauthorizedException('Account is deactivated');
      }
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phoneNumber, loginDto.password);
    const payload = { sub: user.user_id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(payload),
      user: {
        id: user.user_id,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUserByPhone = await this.usersService.findByPhoneNumber(registerDto.phoneNumber);
    if (existingUserByPhone) {
      throw new ConflictException('User with this phone number already exists');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const userFields = {
      email: registerDto.email,
      password_hash: passwordHash,
      phone_number: registerDto.phoneNumber,
      role: undefined, // default role logic if needed
    };
    const profileFields = {
      name: registerDto.name,
    };
    await this.usersService.createWithProfile(userFields, profileFields);
    return { message: 'Registration successful. Please log in.' };
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    const payload = { sub: user.user_id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOneWithProfile(userId);
    return {
      id: user.user_id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      email_verified_at: user.email_verified_at,
      phone_verified_at: user.phone_verified_at,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
      profile: user.profile,
    };
  }

  async signJwtToken(payload: any, expiresIn?: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: expiresIn ?? process.env.JWT_EXPIRES_IN,
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async loginWithKakao(code: string) {
    // Get access token from Kakao
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    const accessToken = tokenRes.data.access_token;
    // Get user info from Kakao
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const kakaoUser = userRes.data;

    const jwt = await this.signJwtToken(kakaoUser);
    return { access_token: jwt, user: kakaoUser };
  }

  async loginWithNaver(code: string, state: string) {
    // Get access token from Naver
    const tokenRes = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code,
        state,
      },
    });
    const accessToken = tokenRes.data.access_token;

    // Get user info from Naver
    const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const naverUser = userRes.data.response;

    // Check user in DB, create new if not exists
    // let user = await this.usersService.findBySocial('naver', naverUser.id);
    // if (!user) {
    //   user = await this.usersService.createSocialUser({
    //     provider: 'naver',
    //     socialId: naverUser.id,
    //     email: naverUser.email,
    //     name: naverUser.name,
    //   });
    // }

    // Return JWT or session
    // (assuming you have a function to create JWT)
    const jwt = await this.signJwtToken(naverUser);
    return { access_token: jwt, user: naverUser };
  }

  async loginWithApple(code: string) {
    // 1. Create client_secret (JWT)
    const privateKey = fs.readFileSync('D:/Work/DongL/dongl-renewal-backend/AuthKey_9PKVDFMBLL.p8');
    const clientSecret = jwt.sign(
      {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        aud: 'https://appleid.apple.com',
        sub: process.env.APPLE_CLIENT_ID,
      },
      privateKey,
      {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID,
      },
    );

    // 2. Exchange code for access_token
    const tokenRes = await axios.post(
      'https://appleid.apple.com/auth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.APPLE_REDIRECT_URI,
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const id_token = tokenRes.data.id_token;
    const appleUser = jwt.decode(id_token);

    // 3. Check user in DB, create new if not exists
    // let user = await this.usersService.findBySocial('apple', appleUser.sub);
    // if (!user) {
    //   user = await this.usersService.createSocialUser({
    //     provider: 'apple',
    //     socialId: appleUser.sub,
    //     email: appleUser.email,
    //     name: appleUser.name,
    //   });
    // }

    // 4. Return JWT or session
    const jwtToken = await this.signJwtToken(appleUser);
    return { access_token: jwtToken, user: appleUser };
  }
}
