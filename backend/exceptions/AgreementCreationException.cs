namespace backend.exceptions;

public class AgreementCreationException : SystemException
{
    public  AgreementCreationException(string message) : base(message)
    {}
}