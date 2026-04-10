namespace backend.models;

public class AgreementResponse
{
    string id { get; set; }
    string firstName { get; set; }
    string email { get; set; } 
    
    public AgreementResponse () {}
    
    public AgreementResponse(string id, string firstName, string email)
    {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
    }
}