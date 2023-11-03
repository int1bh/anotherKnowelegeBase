export interface ICryptoService {
  cipher(data: string): string;

  decipher(data: string): string;
}
