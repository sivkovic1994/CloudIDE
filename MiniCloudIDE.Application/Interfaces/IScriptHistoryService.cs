using MiniCloudIDE.Domain.Entities;

namespace MiniCloudIDE.Application.Interfaces
{
    public interface IScriptHistoryService
    {
        Task SaveScript(string language, string code, string userId);
        Task<List<ScriptHistory>> GetHistory(string language, string userId);
        Task<ScriptHistory?> GetScriptById(int id, string userId);
    }
}
