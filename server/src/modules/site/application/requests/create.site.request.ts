export type SiteType = 
    | "home"
    | "shop"
    | "office"

export interface CreateSiteRequest {
    userId: string,
    name: string,
    type: SiteType
}