import { NotFoundError } from "../../../shared/errors/not.found.error";
import { Site } from "../domain/site.entity";
import { SiteRepository } from "../infrastructure/site.repository";
import { CreateSiteRequest } from "./site.types";

export class SiteService{
    constructor(
        private readonly siteRepository: SiteRepository
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
        const site = new Site();

        site.user = request.user;
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