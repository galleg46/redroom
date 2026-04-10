using backend.dbcontext;
using backend.interfaces;
using backend.service;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddScoped<IWaiverService, WaiverService>();

var app = builder.Build();
app.UseHttpsRedirection();
app.MapControllers();

app.Run();