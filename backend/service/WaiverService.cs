using backend.dbcontext;
using backend.exceptions;
using backend.interfaces;
using backend.models;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
        try
        {
            if (!IsAttendeeInfoComplete(attendee))
            {
                throw new AgreementCreationException("The required information is missing");
            }
            
            _dbContext.EventAttendees.Add(attendee);
            await _dbContext.SaveChangesAsync();
            
            return new AgreementResponse(attendee.Id, attendee.FirstName, attendee.Email);
        }
        catch (DbUpdateException e) when(
            e.InnerException is PostgresException pgE && 
            pgE.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            throw new DuplicateEmailException(attendee.FirstName +" " +attendee.LastName +" has already completed the waiver.");
        }
    }

    private static bool IsAttendeeInfoComplete(EventAttendee attendee)
    {
        return !(attendee.FirstName == "" || attendee.LastName == "" || attendee.Email == "" ||
                attendee.PhoneNumber == "");
    }
}