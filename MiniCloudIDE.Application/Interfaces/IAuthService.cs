using MiniCloudIDE.Application.DTOs;

namespace MiniCloudIDE.Application.Interfaces
{
    public interface IAuthService
    {
        Task<DTOs.AuthResult> RegisterAsync(RegisterRequest request);
        Task<DTOs.AuthResult> LoginAsync(LoginRequest request);
        Task<DTOs.AuthResult> GetCurrentUserAsync(string userId);
    }

}
