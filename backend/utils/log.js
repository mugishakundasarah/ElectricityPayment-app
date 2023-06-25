const fs = require('fs');
const path = require('path');

function storeLog(logMessage) {
  const logFilePath = path.join(__dirname, 'system_logs.log');

  const formattedLog = `[${new Date().toISOString()}]: ${logMessage}\n`;

  fs.appendFile(logFilePath, formattedLog, (err) => {
    if (err) {
      console.error('Failed to store log:', err);
    } 
  });
}

module.exports = storeLog;