namespace MiniCloudIDE_Backend.Models
{
    public class ScriptHistory
    {
        public int Id { get; set; }
        public required string Language { get; set; }
        public string? Code { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}