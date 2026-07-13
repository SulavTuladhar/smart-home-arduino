import { NotFoundError } from "../../../shared/errors/not.found.error";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { Site } from "../domain/site.entity";
import { SiteRepository } from "../infrastructure/site.repository";
import { CreateSiteRequest } from "./requests/create.site.request";

export class SiteService{
    constructor(
        private readonly siteRepository: SiteRepository,
        private readonly userRepository: UserRepository
    ){}

    async getSitesByUser(
        userId: string
    ): Promise<Site[]> {
        return this.siteRepository.findAllByUserId(userId);
    }

    async getSiteById(
        siteId: string
    ): Promise<Site>{
        const site = await this.siteRepository.findById(siteId);

        if(!site){
            throw new NotFoundError(`Site ${siteId} not found`);
        }

        return site;
    }

    async createSite(
        request: CreateSiteRequest
    ): Promise<Site>{
        const user = await this.userRepository.findById(request.userId);

        if(!user){
            throw new NotFoundError(`User not found`);
        }

        const site = new Site();

        site.user = user;
        site.name = request.name;
        site.type = request.type;

        return this.siteRepository.save(site);
    }

    async deleteSite(
        siteId: string
    ): Promise<void>{
        const site = await this.siteRepository.findById(siteId);

        if(!site){
            throw new NotFoundError(`Site ${siteId} not found`);
        }

        return this.siteRepository.remove(site);
    }
}