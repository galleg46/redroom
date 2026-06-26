using backend.interfaces;
using backend.models.config;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace backend.service;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _emailSettings = options.Value;
    }

    public async Task SendEventReminderEmailAsync(string recipient, string eventName, DateTime eventDate)
    {
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
        message.To.Add(MailboxAddress.Parse(recipient));
        message.Subject = $"TONIGHT {eventDate.Date.ToShortDateString()}: Red Room - {eventName}";

        var messageBuilder = new BodyBuilder();
        messageBuilder.HtmlBody = """
                                  <p>Thanks for filling out the form! Here's all the info you need. Please read ALL details CAREFULLY! YOU are responsible for keeping the underground space alive.</p>

                                  <ul>
                                      <li>You are expected to be SILENT ANYTIME you are outside whether you're arriving, leaving, or taking a break. We have neighbors on each side and MUST be silent.</li>
                                      <li>BYO means bring your own - not bring for others.</li>
                                      <li>There is a strict 0 tolerance policy for anything illegal - NO drugs NO weapons.</li>
                                      <li>Safety always comes first. If you feel uncomfortable at any time, or see something - say something. Find Owen or the person working door.</li>
                                  </ul>

                                  <p>Thank you!</p>

                                  <p>We recommend you bring hearing protection and sunglasses, loud decibel levels and intense strobes will be used.</p>

                                  <p>&#x1F534;&#x1F4A1;Look for the red light @ 1529 E Saveland Ave. Milwaukee, WI 53207&#x1F4A1;&#x1F534;</p>

                                  <p>&#x1F6AA;If you didn't pay in advance, $10 at door (Cash ONLY). Enter/exit on the LEFT SIDE door of the building. FRONT DOOR WILL BE LOCKED. NO ID = NO ENTRY.&#x1F6AA;</p>

                                  <p>&#x1F559;10:00 PM till late&#x1F305;</p>

                                  <p>Message Owen with any questions and follow to stay up to date with <a href="https://www.instagram.com/red_room_ofc">Red Room!</a></p>
                                  """;

        message.Body = messageBuilder.ToMessageBody();

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port,
            MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
    }
}