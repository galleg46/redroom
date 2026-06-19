namespace backend.exceptions;

public class EventCreationException : SystemException
{
    public EventCreationException(string message) : base(message)
    {
    }
}