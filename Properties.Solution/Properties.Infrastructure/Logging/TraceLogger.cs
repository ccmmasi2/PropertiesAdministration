using Properties.Application.Interface.Utils;

namespace Properties.Infrastructure.Logging
{
    public class TraceLogger : ITraceLogger
    {
        public void Log(string message)
        {
            File.AppendAllText("trace.log", $"{DateTime.Now}: {message}\n");
        }
    }
}
