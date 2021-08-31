import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AgenciesModule } from '../agencies/agencies.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { CryptService } from './crypt.service';
import { JwtStrategy } from './jwt-strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
      }),
    }),
    forwardRef(() => AgenciesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
