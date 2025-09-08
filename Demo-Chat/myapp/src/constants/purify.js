import axios from "axios";
import DOMPurify from "dompurify";

//
// TODO: Fetch blacklistDomains from the db
//

// Google Safe Browsing API, PhishTank, VirusTotal.

// 1. Check message emptiness
const checkTypeAndEmpty = (message) => {
  if (message.trim() === "") {
    return { safe: false, reason: "empty_message" };
  }
  return { safe: true };
};

// 2. Check message length
const checkLength = (message, maxLength = 200) => {
  if (message.length > maxLength) {
    return { safe: false, reason: "message_too_long" };
  }
  return { safe: true };
};

// 3. Sanitize HTML using DOMPurify
const sanitizeHTML = (message) => {
  const sanitized = DOMPurify.sanitize(message);
  return { safe: true, text: sanitized };
};

// 4. Check for sensitive data (e.g., credit cards)
const checkSensitiveData = (message) => {
  const ccRegex = /\b\d{4}(| |-)\d{4}\1\d{4}\1\d{4}\b/;
  if (ccRegex.test(message)) {
    return { safe: false, reason: "credit_card_detected" };
  }
  return { safe: true };
};

// 5. Detect links
const blacklistedDomains = ["phishingsite.com", "malware.com"];
const checkLinks = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = message.match(urlRegex);
  if (urls && urls.length > 0) {
    for (const url of urls) {
      const hostname = new URL(url).hostname;
      if (blacklistedDomains.includes(hostname)) {
        return { safe: false, reason: "blacklisted_url" };
      }
    }
  }
  return { safe: true };
};

export const validateFrontendMessage = (rawMessage) => {
  let result = checkTypeAndEmpty(rawMessage);
  if (!result.safe) return result;

  result = checkLength(rawMessage);
  if (!result.safe) return result;

  result = sanitizeHTML(rawMessage);
  const sanitized = result.text;

  result = checkSensitiveData(sanitized);
  if (!result.safe) return result;

  result = checkLinks(sanitized);
  if (!result.safe) return result;

  return { safe: true, text: sanitized };
};
