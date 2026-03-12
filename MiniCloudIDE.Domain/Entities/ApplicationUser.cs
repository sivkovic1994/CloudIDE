using Microsoft.AspNetCore.Identity;

namespace MiniCloudIDE.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
