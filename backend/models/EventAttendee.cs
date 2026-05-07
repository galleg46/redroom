namespace backend.models;

public class EventAttendee
{
    public long Id { get; set; }
    
    public string FirstName { get; set; }
    public string LastName  { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime SubmittedAt { get; set; }
    
    public EventAttendee() {}
    
    public EventAttendee(string firstName, string lastName, string email, string phoneNumber)
    {
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Email = email;
        this.PhoneNumber = phoneNumber;
    }
}