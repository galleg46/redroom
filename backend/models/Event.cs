namespace backend.models;

public class Event
{
    public long Id { get; set; }
    
    public string EventName { get; set; }
    public DateTime EventDate { get; set; }
    public string EventDescription { get; set; }
    public List<string> EventLineup { get; set; }
    public string EventPromoter { get; set; }
    public List<string> Genres { get; set; }
    public string AgeRequirement { get; set; }
    public byte[] Flyer { get; set; }
    public string FlyerContentType { get; set; }
    
    public Event() {}

    public Event(string eventName, DateTime eventDate, string eventDescription, List<string> eventLineup,
        string eventPromoter, List<string> genres, string ageRequirement, byte[] flyer, string flyerContentType)
    {
        EventName = eventName;
        EventDate = eventDate;
        EventDescription = eventDescription;
        EventLineup = eventLineup;
        EventPromoter = eventPromoter;
        Genres = genres;
        AgeRequirement = ageRequirement;
        Flyer = flyer;
        FlyerContentType = flyerContentType;
    }
}