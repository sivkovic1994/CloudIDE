using Microsoft.AspNetCore.Identity;

namespace MiniCloudIDE_Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}