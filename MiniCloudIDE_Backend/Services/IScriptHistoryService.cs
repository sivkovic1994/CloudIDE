using MiniCloudIDE_Backend.Models;

namespace MiniCloudIDE_Backend.Services
{
    public interface IScriptHistoryService
    {
        Task SaveScript(string language, string code, string userId);
        Task<List<ScriptHistory>> GetHistory(string language, string userId);
        Task<ScriptHistory?> GetScriptById(int id, string userId);
    }
}