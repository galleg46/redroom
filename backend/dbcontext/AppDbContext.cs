using backend.models;
using Microsoft.EntityFrameworkCore;

namespace backend.dbcontext;

public class AppDbContext : DbContext
{
    public DbSet<EventAttendee> EventAttendees { get; set; }
    public DbSet<Event> Events { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<EventAttendee>()
            .HasIndex(e => e.Email)
            .IsUnique();
        
        modelBuilder.Entity<EventAttendee>()
            .Property(e => e.SubmittedAt)
            .HasDefaultValueSql("NOW()");
        
        modelBuilder.Entity<Event>()
            .Property(e => e.EventDate)
            .HasColumnType("timestamp without time zone");
    }
}