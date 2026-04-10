using backend.models;

namespace backend.interfaces;

public interface IWaiverService
{
    AgreementResponse CreateAgreement(EventAttendee attendee);
}