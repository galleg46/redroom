namespace backend.models;

public class EventNotifications
{
    public long Id { get; set; }
    
    public long EventId { get; set; }
    public long AttendeeId { get; set; }
    public bool EmailNotificationSent { get; set; }
    
    public EventNotifications() {}

    public EventNotifications(long eventId, long attendeeId, bool emailNotificationSent)
    {
        this.EventId = eventId;
        this.AttendeeId = attendeeId;
        this.EmailNotificationSent = emailNotificationSent;
    }
}