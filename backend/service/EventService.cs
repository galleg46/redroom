using backend.dbcontext;
using backend.exceptions;
using backend.interfaces;
using backend.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.service;

public class EventService : IEventService
{
    private readonly AppDbContext _dbContext;
    
    private readonly string[] _allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];

    public EventService(AppDbContext context)
    {
        _dbContext = context;
    }

    public async Task<EventResponse> CreateEvent(EventRequest request)
    {
        if (!_allowedFileTypes.Contains(request.Flyer.ContentType))
        {
            throw new EventCreationException("Invalid file type");
        }

        if (request.Flyer.Length > 10 * 1024 * 1024)
        {
            throw new EventCreationException("File is too large, Flyer must be smaller than 10 MB.");
        }

        byte[] imageBytes;
        using (var memoryStream = new MemoryStream())
        {
            await request.Flyer.CopyToAsync(memoryStream);
            imageBytes = memoryStream.ToArray();
        }

        var e = new Event
        {
            EventName = request.EventName,
            EventDate = request.EventDate,
            EventDescription = request.EventDescription,
            EventLineup = request.EventLineup,
            EventPromoter = request.EventPromoter,
            Genres = request.Genres,
            AgeRequirement = request.AgeRequirement,
            Flyer = imageBytes,
            FlyerContentType = request.Flyer.ContentType
        };

        _dbContext.Events.Add(e);
        await _dbContext.SaveChangesAsync();

        return new EventResponse(e.Id, e.EventName, e.EventDate);
    }

    public async Task<List<Event>> GetEvents()
    {
        return await _dbContext.Events.ToListAsync();
    }

    public async Task<List<Event>> GetUpcomingEvents(int numberOfEvents)
    {
        return await _dbContext.Events
            .Where(e => e.EventDate >= DateTime.Now)
            .OrderBy(e => e.EventDate)
            .Take(numberOfEvents)
            .ToListAsync();
    }

    public async Task<bool> DeleteEvent(int id)
    { 
        var eventToDelete = await _dbContext.Events
            .Where(e => e.Id == id)
            .ExecuteDeleteAsync();

        return eventToDelete > 0 ? true : throw new UpdateEventException($"Deleting event {id} failed, event does not exist");
    }

    public async Task<EventResponse> UpdateEvent(long id, UpdateEventRequest request)
    {
        var existingEvent = await _dbContext.Events.FindAsync(id);

        if (existingEvent == null)
        {
            throw new UpdateEventException($"Event with id {id} not found");
        }

        existingEvent.EventName = request.EventName;
        existingEvent.EventDate = request.EventDate;
        existingEvent.EventDescription = request.EventDescription;
        existingEvent.EventLineup = request.EventLineup;
        existingEvent.EventPromoter = request.EventPromoter;
        existingEvent.Genres = request.Genres;
        existingEvent.AgeRequirement = request.AgeRequirement;

        if (request.Flyer != null)
        {
            byte[] imageBytes;
            using (var memoryStream = new MemoryStream())
            {
                await request.Flyer.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }
            
            existingEvent.Flyer = imageBytes;
            existingEvent.FlyerContentType = request.Flyer.ContentType;
        }

        _dbContext.Events.Update(existingEvent); 
        await _dbContext.SaveChangesAsync();
        
        return new EventResponse(existingEvent.Id, existingEvent.EventName, existingEvent.EventDate);
    }
}