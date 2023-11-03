import {UsersDto} from "../dto/users.dto";

export interface IUsersService {
  findUserByEmail(email: string): Promise<UsersDto>;
}
