namespace backend.models;

public class EventResponse
{
    public long Id { get; set; }
    public string EventName { get; set; }
    public DateTime EventDate { get; set; }
    
    public EventResponse(){}

    public EventResponse(long id, string eventName, DateTime eventDate)
    {
        this.Id = id;
        this.EventName = eventName;
        this.EventDate = eventDate;
    }
    
}