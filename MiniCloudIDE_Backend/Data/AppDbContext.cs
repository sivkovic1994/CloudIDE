using Microsoft.EntityFrameworkCore;
using MiniCloudIDE_Backend.Models;

namespace MiniCloudIDE_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ScriptHistory> ScriptHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fluent API configuration for ScriptHistory entity
            modelBuilder.Entity<ScriptHistory>(entity =>
            {
                entity.ToTable("script_history");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Language)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Code);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("NOW()");
            });
        }
    }
}