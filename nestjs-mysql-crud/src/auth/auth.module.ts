import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { jwtConstants } from './constants';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120s' },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, AuthGuard, Reflector, UserService],
})
export class AuthModule {}
