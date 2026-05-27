namespace DailyLiftApp.Client.Services;

public class EmailService
{
    public async Task SendSubmissionAsync(
        string name,
        string category,
        string content)
    {
        // TEMPORARY TEST

        Console.WriteLine($"""
        NEW SUBMISSION

        Name: {name}

        Category: {category}

        Content:
        {content}
        """);

        await Task.CompletedTask;
    }
}