const morgan = require("morgan");
const logger = require("./logger");

// Keep private installation tokens out of the addon's request logs.
morgan.token("safe-url", (req) =>
  (req.originalUrl || req.url || "").replace(
    /^\/[^/?]+(?=\/(?:manifest\.json|subtitles\/|srt\/))/, "/[REDACTED]"
  )
);

const HTTP_LOG_FORMAT =
  ":method :safe-url :status :res[content-length] - :response-time ms";

const writeToLogger = (message) => logger.http(message.trim());

const httpLogger = morgan(HTTP_LOG_FORMAT, {
  stream: { write: writeToLogger },
});

module.exports = { httpLogger, writeToLogger };
