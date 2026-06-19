using backend.exceptions;
using backend.interfaces;
using backend.models;
using Microsoft.AspNetCore.Mvc;

namespace backend.controller;

[ApiController]
[Route("/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    
    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }
    
    [HttpPost]
    public async Task<ActionResult<EventResponse>> CreateEvent([FromForm] EventRequest newEventRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var response = await _eventService.CreateEvent(newEventRequest);
            
            return Accepted(response);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetAllEvents()
    {
        try
        {
            var response = await _eventService.GetEvents();
            return response;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<List<Event>>> GetUpcomingEvents([FromQuery] int numberOfEvents)
    {
        try
        {
            var response = await _eventService.GetUpcomingEvents(numberOfEvents);
            return response;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEvent(int id)
    {
        try
        {
            await _eventService.DeleteEvent(id);
            
            return NoContent();
        }
        catch (UpdateEventException e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EventResponse>> UpdateEvent(long id, UpdateEventRequest request)
    {
        try
        {
            var eventUpdates = await _eventService.UpdateEvent(id, request);
            
            return Ok(eventUpdates);
        }
        catch (UpdateEventException e)
        {
            return BadRequest(e.Message);
        }
    }
    
    
    [HttpGet("ping")]
    public string Ping()
    {
        return "I'm working in the event api";
    }
}