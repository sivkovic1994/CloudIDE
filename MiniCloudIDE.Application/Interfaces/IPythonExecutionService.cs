namespace MiniCloudIDE.Application.Interfaces
{
    public interface IPythonExecutionService
    {
        Task<(string output, string errors)> ExecuteAsync(string code, CancellationToken cancellationToken = default);
    }
}
