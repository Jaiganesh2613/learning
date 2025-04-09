import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthGuard } from '../auth/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
    CacheModule.register(),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class UserModule {}
