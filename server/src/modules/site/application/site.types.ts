import { User } from "../../users/domain/user.entity"

export type SiteType = 
    | "home"
    | "shop"
    | "office"

export interface CreateSiteRequest {
    user: User,
    name: string,
    type: SiteType
}