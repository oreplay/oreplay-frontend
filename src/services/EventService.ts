import { EventDetailModel, EventModel, Page } from "../shared/EntityTypes";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'https://localhost'
const baseUrl = API_DOMAIN + "/api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
    const response = await fetch(baseUrl, {
        method: "GET"
    });
    return await response.json();
}

export async function getEventDetail(id:string): Promise<EventDetailModel> {
    const response = await fetch(baseUrl + `/${id}`, {
        method: "GET"
    });
    return await response.json();
}