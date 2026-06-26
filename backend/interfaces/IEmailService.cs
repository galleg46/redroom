namespace backend.interfaces;

public interface IEmailService
{
    Task SendEventReminderEmailAsync(string recipient, string eventName, DateTime eventDate);
}