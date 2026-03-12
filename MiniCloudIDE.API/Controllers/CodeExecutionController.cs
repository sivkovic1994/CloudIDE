using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using MiniCloudIDE.Application.DTOs;
using MiniCloudIDE.Application.Interfaces;
using System.Diagnostics;
using System.Security.Claims;

namespace MiniCloudIDE.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CodeExecutionController : ControllerBase
    {
        private readonly IScriptHistoryService _historyService;
        private readonly IPythonExecutionService _pythonExecutionService;

        public CodeExecutionController(IScriptHistoryService historyService, IPythonExecutionService pythonExecutionService)
        {
            _historyService = historyService;
            _pythonExecutionService = pythonExecutionService;
        }

        [HttpPost]
        public async Task<IActionResult> Run([FromBody] CodeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
                return Ok(new { output = "No code entered", executionTimeMs = 0 });

            switch (request.Language.ToLower())
            {
                case "c#":
                    return await RunCSharp(request.Code);
                case "python":
                    return await RunPython(request.Code);
                default:
                    return BadRequest(new { error = "Unsupported language" });
            }
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveScript([FromBody] CodeRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _historyService.SaveScript(request.Language, request.Code, userId);

            var history = await _historyService.GetHistory(request.Language, userId);

            return Ok(history);
        }

        [HttpGet("history/{language}")]
        public async Task<IActionResult> GetHistory(string language)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var history = await _historyService.GetHistory(language, userId);
            return Ok(history);
        }

        [HttpGet("script/{id}")]
        public async Task<IActionResult> GetScriptById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var script = await _historyService.GetScriptById(id, userId);

            if (script == null)
                return NotFound(new { error = "Script not found" });

            return Ok(script);
        }

        private async Task<IActionResult> RunCSharp(string code)
        {
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var scriptOptions = ScriptOptions.Default
                    .WithImports("System")
                    .WithReferences(typeof(object).Assembly);

                var result = await CSharpScript.EvaluateAsync(code, scriptOptions);

                stopwatch.Stop();

                return Ok(new { output = result?.ToString() ?? "null", executionTimeMs = stopwatch.Elapsed.TotalMilliseconds });
            }
            catch (CompilationErrorException ex)
            {
                stopwatch.Stop();
                return Ok(new { output = "", errors = string.Join("\n", ex.Diagnostics), executionTimeMs = stopwatch.Elapsed.TotalMilliseconds });
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return Ok(new { output = "", errors = ex.Message, executionTimeMs = stopwatch.Elapsed.TotalMilliseconds });
            }
        }

        private async Task<IActionResult> RunPython(string code)
        {
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var (output, errors) = await _pythonExecutionService.ExecuteAsync(code);

                stopwatch.Stop();

                return Ok(new { output, errors, executionTimeMs = stopwatch.Elapsed.TotalMilliseconds });
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return Ok(new { output = "", errors = ex.Message, executionTimeMs = stopwatch.Elapsed.TotalMilliseconds });
            }
        }
    }
}
