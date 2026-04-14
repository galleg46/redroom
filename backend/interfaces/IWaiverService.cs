using backend.models;

namespace backend.interfaces;

public interface IWaiverService
{
    Task<AgreementResponse> CreateAgreement(EventAttendee attendee);
}