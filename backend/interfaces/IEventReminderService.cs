using backend.models;

namespace backend.interfaces;

public interface IEventReminderService
{
    Task SendEventReminders();
    Task QueueEventReminders();
    Task<List<EventNotifications>> GetQueuedNotifications(long eventId);
}