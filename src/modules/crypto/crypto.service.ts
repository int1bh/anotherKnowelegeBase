import { Injectable } from '@nestjs/common';
import { ICryptoService } from './interface/crypto-interface';
import * as crypto from 'crypto';
import { CharacterEncoding } from 'crypto';

@Injectable()
export class CryptoService implements ICryptoService {
  private readonly CRYPT_SETTING = {
    // GCM is an authenticated encryption mode that not only provides confidentiality but also  provides integrity in a secured way
    ALGORITHM: 'aes-256-cbc',
    SALT: 'salt-security-project', // соль для генерации ключа crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);32
    // вектора инициализации crypto.randomBytes(ALGORITHM.IV_BYTE_LEN).toString('hex').slice(0, 16);
    IV: Buffer.from('acf95c1c42ac9604acf95c1c42ac9604', 'hex'),
    KEY: 'key-security-project', // ключевое слово по умолчанию, в реальном проекте лучше хранить в отдельном файле на сервере
    LEN_KEY: 32, // размер генерируемого ключа
    INPUT_ENCODING: 'utf8' as CharacterEncoding, // кодировка текста на вход шифрованию и на выход разшифровки
    OUTPUT_ENCODING: 'base64' as CharacterEncoding // кодировка текста на выходе шифрования и на вход разшифровке
  };

  cipher(data: string): string {
    // генерация ключа, если пришло ключевое слово
    const key = crypto.scryptSync(this.CRYPT_SETTING.KEY, this.CRYPT_SETTING.SALT, this.CRYPT_SETTING.LEN_KEY);
    const cipher = crypto.createCipheriv(this.CRYPT_SETTING.ALGORITHM, key, this.CRYPT_SETTING.IV);
    let encryptedMessage = cipher.update(data, this.CRYPT_SETTING.INPUT_ENCODING, this.CRYPT_SETTING.OUTPUT_ENCODING);
    encryptedMessage += cipher.final(this.CRYPT_SETTING.OUTPUT_ENCODING);
    return encryptedMessage;
  }

  decipher(data: string): string {
    // генерация ключа, если пришло ключевое слово
    const key = crypto.scryptSync(this.CRYPT_SETTING.KEY, this.CRYPT_SETTING.SALT, this.CRYPT_SETTING.LEN_KEY);
    const decrypted = crypto.createDecipheriv(this.CRYPT_SETTING.ALGORITHM, key, this.CRYPT_SETTING.IV);
    let decryptedData = decrypted.update(data, this.CRYPT_SETTING.OUTPUT_ENCODING, this.CRYPT_SETTING.INPUT_ENCODING);
    decryptedData += decrypted.final(this.CRYPT_SETTING.INPUT_ENCODING);
    return decryptedData;
  }
}
