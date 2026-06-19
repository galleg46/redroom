namespace backend.models;

public class EventRequest
{
    public string EventName { get; set; }
    public DateTime EventDate { get; set; }
    public string EventDescription { get; set; }
    public List<string> EventLineup { get; set; }
    public string EventPromoter { get; set; }
    public List<string> Genres { get; set; }
    public string AgeRequirement { get; set; }
    public IFormFile Flyer { get; set; }
    
    public EventRequest() {}
    
    public EventRequest(string eventName, DateTime eventDate, string eventDescription, List<string> eventLineup,
    string eventPromoter, List<string> genres, string ageRequirement,  IFormFile flyer)
    {
        EventName = eventName;
        EventDate = eventDate;
        EventDescription = eventDescription;
        EventLineup = eventLineup;
        EventPromoter = eventPromoter;
        Genres = genres;
        AgeRequirement = ageRequirement;
        Flyer = flyer;
    }
}