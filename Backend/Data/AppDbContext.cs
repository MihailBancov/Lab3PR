
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Models.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.Task>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
                
            modelBuilder.Entity<Models.Task>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}