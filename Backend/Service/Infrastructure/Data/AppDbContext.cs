using Microsoft.EntityFrameworkCore;
using Service.Domain.Models;

namespace Service.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .Property(u => u.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<Workout>()
                .Property(w => w.Type)
                .HasConversion<string>();


            modelBuilder.Entity<Workout>()
                .ToTable(t =>
                {
                    t.HasCheckConstraint("CK_Workout_Intensity", "\"Intensity\" BETWEEN 1 AND 10");
                    t.HasCheckConstraint("CK_Workout_Fatigue", "\"Fatigue\" BETWEEN 1 AND 10");
                });

        }
    }
}
