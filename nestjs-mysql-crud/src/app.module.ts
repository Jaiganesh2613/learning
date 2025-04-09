import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jaiganesh',
      database: 'nest_crud',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    CacheModule.register(),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
