// Input validation and sanitization utilities

export const sanitizeString = (str, maxLength = 255) => {
  if (typeof str !== 'string') return ''
  // Remove null bytes and trim
  let sanitized = str.replace(/\0/g, '').trim()
  // Limit length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  return sanitized
}

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false
  // Alphanumeric and underscore only, 3-30 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  return usernameRegex.test(username.trim())
}

export const validateFullName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return false
  // Allow letters, spaces, and common name characters, 2-100 characters
  const nameRegex = /^[a-zA-Z\s.'-]{2,100}$/
  return nameRegex.test(fullName.trim())
}

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false
  // Minimum 6 characters
  return password.length >= 6 && password.length <= 100
}

export const sanitizeMessage = (message, maxLength = 2000) => {
  if (typeof message !== 'string') return ''
  // Remove null bytes, trim, and limit length
  let sanitized = message.replace(/\0/g, '').trim()
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  return sanitized
}

