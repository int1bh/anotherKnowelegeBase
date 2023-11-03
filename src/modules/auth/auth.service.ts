import {Inject, Injectable, NotAcceptableException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CryptoService} from "../crypto/crypto.service";
import {ICryptoService} from "../crypto/interface/crypto-interface";

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      @Inject(CryptoService) private readonly cryptoService: ICryptoService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    const passwordValid = this.cryptoService.decipher(user.password) === password;
    if (!user) {
        throw new NotAcceptableException('Пользователь не найден');
      }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }
}

