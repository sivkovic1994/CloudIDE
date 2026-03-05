using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Diagnostics;

namespace MiniCloudIDE_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CodeExecutionController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Run([FromBody] CodeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
                return Ok(new { output = "No code entered" });

            switch (request.Language.ToLower())
            {
                case "c#":
                    return await RunCSharp(request.Code);
                case "python":
                    return RunPython(request.Code);
                default:
                    return BadRequest(new { error = "Unsupported language" });
            }
        }

        private async Task<IActionResult> RunCSharp(string code)
        {
            try
            {
                // Configure Roslyn scripting environment with basic imports and references.
                var scriptOptions = ScriptOptions.Default
                    .WithImports("System")
                    .WithReferences(typeof(object).Assembly);

                // Run C# code in-memory with Roslyn (no external process).
                var result = await CSharpScript.EvaluateAsync(code, scriptOptions);

                return Ok(new { output = result?.ToString() ?? "null" });
            }
            catch (CompilationErrorException ex)
            {
                return Ok(new { output = string.Join("\n", ex.Diagnostics) });
            }
        }

        private IActionResult RunPython(string code)
        {
            try
            {
                // Execute Python code by starting an external process.
                // Python must be installed and available in the system PATH.
                // Unlike C#, Python does not have a built-in .NET interpreter.
                var psi = new ProcessStartInfo
                {
                    FileName = "python",  // interpreter to run the code
                    Arguments = $"-c \"{code.Replace("\"", "\\\"")}\"",
                    RedirectStandardOutput = true, 
                    RedirectStandardError = true,  
                    UseShellExecute = false,       
                    CreateNoWindow = true          
                };

                using var process = Process.Start(psi);
                if (process == null)
                {
                    return Ok(new { output = "", errors = "Failed to start Python process." });
                }
                process.WaitForExit(5000);

                string output = process.StandardOutput.ReadToEnd();
                string errors = process.StandardError.ReadToEnd();

                return Ok(new { output, errors });
            }
            catch (Exception ex)
            {
                return Ok(new { output = "", errors = ex.Message });
            }
        }
    }

    public class CodeRequest
    {
        public string Language { get; set; } = "C#";
        public string Code { get; set; } = "";
    }
}