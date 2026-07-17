import { PasswordHasher } from "../../../shared/core/security/password/password.hasher";
import { TokenProvider } from "../../../shared/core/security/token/token.provider";
import { User } from "../domain/user.entity";
import { UserRepository } from "../infrastructure/user.repository";
import { CreateUserRequest } from "./requests/create.user.request";
import { LoginRequest } from "./requests/login.request";
import { LoginResponse } from "./responses/login.response";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenProvider: TokenProvider
    ){}

    async register(request: CreateUserRequest): Promise<User>{
        throw new Error("IMp")
    }

    async login(request: LoginRequest): Promise<LoginResponse>{
        throw new Error("IMp")
    }
}