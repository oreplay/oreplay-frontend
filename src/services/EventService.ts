import { EventDetailModel, EventModel, Page } from "../shared/EntityTypes";

const baseUrl = "https://localhost/api/v1/events"

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