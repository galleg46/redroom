using backend.models;
using Microsoft.EntityFrameworkCore;

namespace backend.dbcontext;

public class AppDbContext : DbContext
{
    public DbSet<EventAttendee> EventAttendees { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
}