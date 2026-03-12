using Microsoft.EntityFrameworkCore;
using MiniCloudIDE.Application.Interfaces;
using MiniCloudIDE.Domain.Entities;
using MiniCloudIDE.Infrastructure.Data;

namespace MiniCloudIDE.Infrastructure.Services
{
    public class ScriptHistoryService : IScriptHistoryService
    {
        private readonly AppDbContext _context;

        public ScriptHistoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveScript(string language, string code, string userId)
        {
            var script = new ScriptHistory
            {
                Language = language,
                Code = code,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.ScriptHistories.Add(script);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ScriptHistory>> GetHistory(string language, string userId)
        {
            return await _context.ScriptHistories
                .Where(s => s.Language == language && s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<ScriptHistory?> GetScriptById(int id, string userId)
        {
            return await _context.ScriptHistories
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        }
    }
}
