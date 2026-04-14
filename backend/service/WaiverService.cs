using backend.dbcontext;
using backend.exceptions;
using backend.interfaces;
using backend.models;

namespace backend.service;

public class WaiverService : IWaiverService
{
    private readonly AppDbContext _dbContext;
    
    public WaiverService(AppDbContext context)
    {
        _dbContext = context;
    }
    
    public async Task<AgreementResponse> CreateAgreement(EventAttendee attendee)
    {
        if (!IsAttendeeInfoComplete(attendee))
        {
            throw new AgreementCreationException("The required information is missing");
        }
        
        //temp code
        EventAttendee newRecord = new EventAttendee("1", attendee.FirstName, attendee.LastName, attendee.Email,
                                                        attendee.PhoneNumber);
        _dbContext.EventAttendees.Add(newRecord);
        await _dbContext.SaveChangesAsync();
        
        //temp response
        return new AgreementResponse(newRecord.Id, newRecord.FirstName, newRecord.Email);
    }

    private static bool IsAttendeeInfoComplete(EventAttendee attendee)
    {
        return !(attendee.FirstName == "" || attendee.LastName == "" || attendee.Email == "" ||
                attendee.PhoneNumber == "");
    }
}