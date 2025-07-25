import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { UserRole } from '../src/modules/users/enums/user-role.enum';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: UserRole.USER,
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data.user.email).toBe(createUserDto.email);
        });
    });

    it('should return 400 for invalid email', () => {
      const invalidUserDto = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidUserDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const createUserDto: CreateUserDto = {
        email: 'login-test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: UserRole.USER,
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(createUserDto);

      // Then login
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: createUserDto.email,
          password: createUserDto.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          expect(res.body.data).toHaveProperty('user');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});