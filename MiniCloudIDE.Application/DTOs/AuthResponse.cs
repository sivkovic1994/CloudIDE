namespace MiniCloudIDE.Application.DTOs
{
    public class AuthResponse
    {
        public required string Token { get; set; }
        public required string Email { get; set; }
        public required string UserId { get; set; }
        public string? Username { get; set; }
    }
}
