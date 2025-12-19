// Logger utility for authentication and API logging
const logger = {
  // Log successful login attempts
  logLoginSuccess: (username, ip, userAgent) => {
    console.log(`[LOGIN_SUCCESS] User: ${username}, IP: ${ip}, User-Agent: ${userAgent}, Timestamp: ${new Date().toISOString()}`);
  },

  // Log failed login attempts
  logLoginFailure: (username, ip, userAgent, reason) => {
    console.warn(`[LOGIN_FAILURE] User: ${username}, IP: ${ip}, User-Agent: ${userAgent}, Reason: ${reason}, Timestamp: ${new Date().toISOString()}`);
  },

  // Log registration attempts
  logRegistration: (username, email, ip, userAgent) => {
    console.log(`[REGISTRATION] User: ${username}, Email: ${email}, IP: ${ip}, User-Agent: ${userAgent}, Timestamp: ${new Date().toISOString()}`);
  },

  // Log security events
  logSecurityEvent: (event, details) => {
    console.log(`[SECURITY] ${event}: ${JSON.stringify(details)}, Timestamp: ${new Date().toISOString()}`);
  },

  // Log database operations
  logDatabase: (operation, collection, details) => {
    console.log(`[DATABASE] ${operation} on ${collection}: ${JSON.stringify(details)}, Timestamp: ${new Date().toISOString()}`);
  }
};

export default logger;
