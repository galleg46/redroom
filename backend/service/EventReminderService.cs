using backend.dbcontext;
using backend.interfaces;

namespace backend.service;

public class EventReminderService : IEventReminderService
{
    private readonly IEventService _eventService;
    private readonly IEmailService _emailService;
    private readonly IWaiverService _waiverService;

    public EventReminderService(IEventService eventService,  IEmailService emailService, IWaiverService waiverService)
    {
        _eventService = eventService;
        _emailService = emailService;
        _waiverService = waiverService;
    }

    public async Task SendEventReminders()
    {
        var nextEvent = await _eventService.GetUpcomingEvents(1);
        if (nextEvent[0].EventDate.Date == DateTime.Today.Date)
        {
            var eventAttendees = await _waiverService.GetAllAttendees();
            foreach (var attendee in eventAttendees)
            {
                await _emailService.SendEventReminderEmailAsync(attendee.Email, 
                                                                        nextEvent[0].EventName, 
                                                                        nextEvent[0].EventDate);
            }
            Console.WriteLine("sent invite");
        }
    }
}