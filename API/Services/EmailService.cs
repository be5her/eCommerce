using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace API.Services;
public interface IEmailService
{
    public Task SendEmailAsync(string toName, string toEmail, string subject, string body, TextFormat type = TextFormat.Plain);
}

public class EmailService : IEmailService
{


    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toName, string toEmail, string subject, string body, TextFormat type = TextFormat.Plain)
    {
        var mailMessage = new MimeMessage();
        mailMessage.From.Add(new MailboxAddress(_config["Email:FromName"], _config["Email:FromEmail"]));
        mailMessage.To.Add(new MailboxAddress(toName, toEmail));
        mailMessage.Subject = subject;
        mailMessage.Body = new TextPart(type)
        {
            Text = body
        };

        using (var smtpClient = new SmtpClient())
        {
            await smtpClient.ConnectAsync("smtp.gmail.com", 465, SecureSocketOptions.SslOnConnect);
            await smtpClient.AuthenticateAsync(_config["Email:UserName"], _config["Email:Pass"]);
            await smtpClient.SendAsync(mailMessage);
            await smtpClient.DisconnectAsync(true);
        }

    }
}
