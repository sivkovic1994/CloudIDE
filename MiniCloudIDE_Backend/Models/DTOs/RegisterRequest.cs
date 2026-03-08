namespace MiniCloudIDE_Backend.Models.DTOs
{
    public class RegisterRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Username { get; set; }
    }
}