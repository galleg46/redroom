using backend.interfaces;
using backend.models;

namespace backend.service;

public class WaiverService : IWaiverService
{
    public AgreementResponse CreateAgreement()
    {
        return new AgreementResponse();
    }
}