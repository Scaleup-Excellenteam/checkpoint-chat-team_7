import DOMPurify from "dompurify";

// 1. Check message emptiness
const checkTypeAndEmpty = (message) => {
  if (message.trim() === "") {
    console.log("empty");

    return { safe: false, reason: "empty_message" };
  }
  return { safe: true };
};

// 2. Check message length
const checkLength = (message, maxLength = 200) => {
  if (message.length > maxLength) {
    console.log("message_too_long", message.length);
    return { safe: false, reason: "message_too_long" };
  }
  return { safe: true };
};

// 3. Sanitize HTML using DOMPurify
const sanitizeHTML = (message) => {
  const sanitized = DOMPurify.sanitize(message);
  return { safe: true, text: sanitized };
};

export const validateFrontendMessage = (rawMessage) => {
  let result = checkTypeAndEmpty(rawMessage);
  if (!result.safe) return result;

  result = checkLength(rawMessage);
  if (!result.safe) return result;

  result = sanitizeHTML(rawMessage);
  const sanitized = result.text;
  if (!result.safe) return result;

  return { safe: true, text: sanitized };
};
