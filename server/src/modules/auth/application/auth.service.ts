import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, RegisterRequest, RegisterResponse } from "@iot/contracts";
import { TransactionManager } from "../../../infrastructure/database/transaction.manager";
import { PasswordHasher } from "../../../shared/core/security/password/password.hasher";
import { TokenProvider } from "../../../shared/core/security/token/token.provider";
import { ConflictError } from "../../../shared/errors/conflict.error";
import { Site } from "../../site/domain/site.entity";
import { SiteRepository } from "../../site/infrastructure/site.repository";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { User } from "../../user/domain/user.entity";
import { UnauthorizedError } from "../../../shared/errors/unauthorized.error";

export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly siteRepository: SiteRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenProvider: TokenProvider,
        private readonly transactionManager: TransactionManager,
    ){}

    async register(request: RegisterRequest): Promise<RegisterResponse>{
        const email = request.email.trim().toLowerCase();
        const exisitingUser = await this.userRepository.findByEmail(email);

        if(exisitingUser){
            throw new ConflictError("Email is already registered");
        }

        const passwordHash = await this.passwordHasher.hash(request.password);

        return this.transactionManager.execute(
            async(manager): Promise<RegisterResponse> => {
                const user = new User();

                user.name = request.name.trim();
                user.email = email;
                user.passwordHash = passwordHash;

                const savedUser = await this.userRepository.save(user, manager);

                const site = new Site();

                site.name = "My Home";
                site.type = "home";
                site.user = savedUser;

                await this.siteRepository.save(site, manager);
                return savedUser;
            }
        )
    }

    async login(request: LoginRequest): Promise<LoginResponse>{
        const email = request.email.trim().toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if(!user) throw new UnauthorizedError("Invalid email or password");

        const passwordMatches = await this.passwordHasher.compare(request.password, user.passwordHash);

        if(!passwordMatches) throw new UnauthorizedError("Invalid email or password");

        return this.tokenProvider.generateTokenPair(user.id);
    }

    async refresh(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        const claims = await this.tokenProvider.verifyRefreshToken(request.refreshToken);

        return this.tokenProvider.generateTokenPair(claims.sub);
    }
}