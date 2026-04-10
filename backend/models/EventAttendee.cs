namespace backend.models;

public class EventAttendee
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName  { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    
    public EventAttendee() {}
    
    public EventAttendee(string id, string firstName, string lastName, string email, string phoneNumber)
    {
        this.Id = id;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Email = email;
        this.PhoneNumber = phoneNumber;
    }
}