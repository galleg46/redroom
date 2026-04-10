using backend.interfaces;
using backend.service;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<IWaiverService, WaiverService>();

var app = builder.Build();
app.UseHttpsRedirection();
app.MapControllers();

app.Run();