using backend.dbcontext;
using backend.interfaces;
using backend.models;
using Microsoft.EntityFrameworkCore;

namespace backend.service;

public class EventReminderService : IEventReminderService
{
    private readonly AppDbContext _dbcontext;
    
    private readonly IEventService _eventService;
    private readonly IEmailService _emailService;
    private readonly IWaiverService _waiverService;

    public EventReminderService(IEventService eventService,  IEmailService emailService, IWaiverService waiverService, AppDbContext context)
    {
        _eventService = eventService;
        _emailService = emailService;
        _waiverService = waiverService;
        _dbcontext = context;
    }

    public async Task SendEventReminders()
    {
        var nextEvent = await _eventService.GetUpcomingEvents(1);
        if (nextEvent[0].EventDate.Date == DateTime.Today.Date)
        {   
            var eventAttendees = await GetQueuedNotifications(nextEvent[0].Id);
            if (eventAttendees.Count == 0)
            {
                Console.WriteLine("Invites are caught up, nothing to send.");
            }
            else
            {
                foreach (var attendee in eventAttendees)
                {
                    var attendeeInfo = await _waiverService.GetAttendeeById(attendee.AttendeeId);
                    await _emailService.SendEventReminderEmailAsync(attendeeInfo.Email, 
                        nextEvent[0].EventName, 
                        nextEvent[0].EventDate);
                    attendee.EmailNotificationSent = true;
                    _dbcontext.EventNotifications.Update(attendee);
                    
                    await _dbcontext.SaveChangesAsync();
                }
                Console.WriteLine("sent invite(s)");
            }
        }
    }

    public async Task QueueEventReminders()
    {
        var nextEvent = await _eventService.GetUpcomingEvents(1);
        if (nextEvent[0].EventDate.Date == DateTime.Today.Date)
        {
            var nextEventId = nextEvent[0].Id;
            await _dbcontext.Database
                .ExecuteSqlInterpolatedAsync($"""
                                              INSERT INTO "EventNotifications"
                                                    ("EventId", "AttendeeId", "EmailNotificationSent")
                                              SELECT
                                                  {nextEventId},
                                                  a."Id",
                                                  FALSE
                                              FROM "EventNotifications" as a
                                              ON CONFLICT ("EventId", "AttendeeId") DO NOTHING;
                                              """);
            
            Console.WriteLine("Emails Queued.");
        }
    }

    public async Task<List<EventNotifications>> GetQueuedNotifications(long eventId)
    {
        return await _dbcontext.EventNotifications
            .Where(n => n.EventId == eventId && n.EmailNotificationSent == false)
            .ToListAsync();
    }
}