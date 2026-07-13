import { PasswordHasher } from "./password.hasher";
import bcrypt from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher{
    constructor(
        private readonly saltRounds: number
    ){}

    async hash(password: string): Promise<string>{
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hash: string): Promise<boolean>{
        return bcrypt.compare(password, hash);
    }
}