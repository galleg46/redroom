using backend.models;
using Microsoft.AspNetCore.Mvc;

namespace backend.interfaces;

public interface IEventService
{
    Task<EventResponse> CreateEvent(EventRequest newEvent);
    Task<List<Event>> GetEvents();
    Task<List<Event>> GetUpcomingEvents(int numberOfEvents);
    Task<bool> DeleteEvent(int id);
    Task<EventResponse> UpdateEvent(long id, UpdateEventRequest request);
}