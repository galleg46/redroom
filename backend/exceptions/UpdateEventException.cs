namespace backend.exceptions;

public class UpdateEventException : SystemException
{
    public  UpdateEventException(string message) : base(message)
    {
    }
}