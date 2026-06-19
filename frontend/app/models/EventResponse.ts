export interface EventResponse {
    id: number;
    eventName: string;
    eventDate: string;
    eventDescription: string;
    eventLineup: string[];
    eventPromoter: string;
    genres: string[];
    ageRequirement: string;
    flyer: string;
    flyerContentType: string;
}