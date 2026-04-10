using backend.exceptions;
using backend.interfaces;
using backend.models;
using Microsoft.AspNetCore.Mvc;

namespace backend.controller;

[ApiController]
[Route("/[controller]")]
public class WaiverController : ControllerBase
{
    private readonly IWaiverService _waiverService;

    public WaiverController(IWaiverService waiverService)
    {
        this._waiverService = waiverService;
    }
    
    
    [HttpPost]
    public ActionResult<AgreementResponse> CreateAgreement([FromBody] EventAttendee attendee)
    {
        try
        {
            var response = _waiverService.CreateAgreement(attendee);
            
            return Accepted(response);
        }
        catch (AgreementCreationException e)
        {
            return  BadRequest(e.Message);
        }
        
    }
    
    
    
    [HttpGet("ping")]
    public string Ping()
    {
        return "I'm working in the waiver api";
    }
}