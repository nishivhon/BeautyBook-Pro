// Shared in-memory storage for OTPs
// Note: These Maps persist across function invocations within the same container
// For production, use a database instead

export const emailOtpStorage = new Map();
export const smsOtpStorage = new Map();
