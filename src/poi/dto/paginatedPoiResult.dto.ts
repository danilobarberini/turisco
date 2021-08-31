import { POI } from "../entities/poi.entity"

export class PaginatedPoiResultDto {
    data: POI[]
    page: number
    totalCount: number
}