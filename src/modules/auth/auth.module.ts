import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import {UsersModule} from "../users/users.module";
import {CryptoModule} from "../crypto/crypto.module";

@Module({
  imports: [UsersModule, CryptoModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer]
})
export class AuthModule {}

