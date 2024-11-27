using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Ecommerce.Contracts.Interfaces;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendEmailAsync(string emailTo, string subject, string? body=null,IList<IFormFile> attachments = null)
    {
        var email = CreateEmailMessage(emailTo, subject); // Create the email message

        // Build the email body
        body = BuildEmailBody(body!,subject);

        // Set the HTML body to the email message
        email.Body = new BodyBuilder { HtmlBody = body }.ToMessageBody();

        // Handle attachments if they exist
        if (attachments != null)
        {
            AddAttachments(email, attachments);
        }

        // Send the email using SMTP
       var result= await SendEmailAsync(email);
       return result;
    }

    private MimeMessage CreateEmailMessage(string emailTo, string subject)
    {
        var email = new MimeMessage
        {
            Sender = MailboxAddress.Parse(_configuration["Smtp:Username"]),
            Subject = subject
        };

        email.To.Add(MailboxAddress.Parse(emailTo)); // Add recipient
        return email;
    }

    private string BuildEmailBody( string body, string? subject = "Confirm your email address ")
    {
        // Email body with inline styles for presentation
        return $@"
    <html>
        <head>
            <style>
                h1 {{
                    color: #535154;
                    text-align: center;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 30px;
                }}
                .p-1 {{
                    font-size: 15px;
                    color: rgb(36, 80, 82);
                }}
                .button {{
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-inline: 10px;
                    background-color: #2da663;
                    color: white;
                    font-weight: bold;
                    width: 200px;
                    text-align: center;
                    border-radius: 5px;
                    font-size: 20px;
                }}
                li {{
                    color: #555;
                    line-height: 1.5;
                }}
                ul {{
                    margin-inline: 15px;
                    padding-inline: 10px;
                }}
                .container {{
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    padding: 20px;
                }}
                a {{
                    color: #007bff;
                    text-decoration: none;
                }}
                a:hover {{
                    text-decoration: underline;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>{subject} to get started on<span style='color: rgb(6, 130, 213)'>Voltora</span></h1>
                <p class='p-1'>
                    Once you've confirmed that <span style='color: rgb(6, 130, 213); font-weight: bold;'>{{kaloyan.yankulov@gmail.com}}</span> 
                    is your email address, we'll help you find your Voltora workspaces or create a new one.
                </p>
                <div class='button'>
                    {body}
                </div>
                <h3>Security Tips:</h3>
                <ul>
                    <li>Never give your password to anyone.</li>
                    <li>Never call any phone number for someone claiming to be Binance Support.</li>
                    <li>Never send any money to anyone claiming to be a member of the Binance team.</li>
                    <li>Enable Google Two Factor Authentication.</li>
                </ul>
            </div>
        </body>
    </html>
    ";
    }


    private void AddAttachments(MimeMessage email, IList<IFormFile> attachments)
    {
        var builder = new BodyBuilder();

        foreach (var file in attachments)
        {
            if (file.Length > 0) // Check if the file has content
            {
                using var ms = new MemoryStream();
                file.CopyTo(ms); // Copy the file stream to memory
                builder.Attachments.Add(file.FileName, ms.ToArray(), ContentType.Parse(file.ContentType)); // Add attachment
            }
        }

        email.Body = builder.ToMessageBody(); // Set the updated body with attachments
    }

    private async Task<bool> SendEmailAsync(MimeMessage email)
    {
        using var smtp = new SmtpClient();
        try
        {
            smtp.Connect(_configuration["Smtp:Host"], _configuration.GetValue<int>("Smtp:Port"), SecureSocketOptions.StartTls); // Connect to SMTP server
            smtp.Authenticate(_configuration["Smtp:Username"], _configuration["Smtp:Password"]); // Authenticate using username and password
            await smtp.SendAsync(email); 
            return true;
        }
        catch(Exception ex)
        {
            return false;
        }
        finally
        {
            smtp.Disconnect(true); 
        }
    }
}
