namespace DailyLiftApp.Client.Models
{
    public class LiftItem
    {
        public int Id { get; set; }

        public string Category { get; set; } = "";

        public string Title { get; set; } = "";

        public string Content { get; set; } = "";

        public string Combined { get; set; } = "";
    }
}