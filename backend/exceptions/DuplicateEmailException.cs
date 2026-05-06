namespace backend.exceptions;

public class DuplicateEmailException : SystemException
{
    public  DuplicateEmailException(string message) : base(message)
    {}
}