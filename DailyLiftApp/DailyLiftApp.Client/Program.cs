using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using DailyLiftApp.Client.Services;
using System.Net.Http;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});

builder.Services.AddScoped<LiftService>();

await builder.Build().RunAsync();