using DailyLiftApp.Client.Models;
using System.Net.Http.Json;

namespace DailyLiftApp.Client.Services
{
    public class LiftService
    {
        private readonly HttpClient _http;

        private List<LiftItem>? _lifts;

        public LiftService(HttpClient http)
        {
            _http = http;
        }

        public async Task<List<LiftItem>> GetLiftsAsync()
        {
            if (_lifts != null)
                return _lifts;

            _lifts = await _http.GetFromJsonAsync<List<LiftItem>>("data/lifts.json")
                     ?? new List<LiftItem>();

            return _lifts;
        }

        public async Task<LiftItem?> GetRandomLiftAsync()
        {
            var lifts = await GetLiftsAsync();

            if (!lifts.Any())
                return null;

            var random = new Random();

            return lifts[random.Next(lifts.Count)];
        }
    }
}