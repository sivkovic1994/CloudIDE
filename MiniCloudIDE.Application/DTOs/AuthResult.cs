namespace MiniCloudIDE.Application.DTOs
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public AuthResponse? Data { get; set; }
        public object? Errors { get; set; }
        public int StatusCode { get; set; } = 200;
    }
}