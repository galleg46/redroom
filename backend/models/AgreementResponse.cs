namespace backend.models;

public class AgreementResponse
{
    public string id { get; set; }
    public string firstName { get; set; }
    public string email { get; set; } 
    
    public AgreementResponse () {}
    
    public AgreementResponse(string id, string firstName, string email)
    {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
    }
}