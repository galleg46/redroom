using backend.models;

namespace backend.interfaces;

public interface IWaiverService
{
    AgreementResponse CreateAgreement();
}