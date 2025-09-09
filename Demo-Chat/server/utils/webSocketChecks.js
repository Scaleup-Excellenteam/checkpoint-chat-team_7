const blacklistsBLL = require("../BLL/blacklistsBLL");

const createDOMPurify = require("isomorphic-dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

//Check type & empty
const checkIfEmpty = (text) => {
  if (text.trim() === "") {
    return { safe: false, reason: "empty_message" };
  }
  return { safe: true };
};

//Check length
const checkLength = (text, maxLength = 200) => {
  if (text.length > maxLength) {
    return { safe: false, reason: "message_too_long" };
  }
  return { safe: true };
};

//Sanitize HTML
const sanitizeHTML = (text) => {
  const sanitized = DOMPurify.sanitize(text);
  return { safe: true, text: sanitized };
};

const extractUrls = (text) => {
  const URL_RE = /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi;
  const urls = [];
  text.replace(URL_RE, (m) => {
    urls.push(m);
    return m;
  });
  return urls;
};

const getHostname = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
};

//Check Blacklists
const checkBlacklist = async (message) => {
  const lists = await blacklistsBLL.getAllLists();

  const words = message.toLowerCase().split(/\W+/);

  const urls = extractUrls(message);
  const hosts = urls.map(getHostname).filter(Boolean);

  for (const entry of lists) {
    const { listCategory, blacklist } = entry;

    for (const item of blacklist) {
      const target = item.toLowerCase();

      if (listCategory === "domains") {
        if (hosts.includes(target)) {
          return {
            safe: false,
            reason: "blacklisted_domain",
            match: target,
          };
        }
      }

      if (listCategory === "words") {
        if (words.includes(target)) {
          return {
            safe: false,
            reason: "blacklisted_word",
            match: target,
          };
        }
      }
    }
  }
  return { safe: true };
};

function isValidLuhn(number) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function checkCreditCard(message) {
  const ccRegex = /\b(?:\d[ -]*?){13,19}\b/g;

  const matches = message.match(ccRegex);
  if (!matches) {
    return { safe: true };
  }

  for (const match of matches) {
    const digits = match.replace(/\D/g, "");
    if (isValidLuhn(digits)) {
      return { safe: false, reason: "credit_card_detected", match: message };
    }
  }

  return { safe: true };
}

/* =================== Main inspect function =================== */
async function inspectMessage(text) {
  let result = checkIfEmpty(text);
  if (!result.safe)
    return { action: "block", text, reasons: [{ kind: result.reason }] };

  result = checkLength(text);
  if (!result.safe)
    return { action: "block", text, reasons: [{ kind: result.reason }] };

  result = sanitizeHTML(text);
  const sanitized = result.text;

  result = await checkBlacklist(sanitized);

  if (!result.safe) {
    return {
      action: "block",
      text: sanitized,
      reasons: [{ kind: result.reason, match: result.match }],
    };
  }

  result = checkCreditCard(sanitized);
  if (!result.safe) {
    return {
      action: "block",
      text: sanitized,
      reasons: [{ kind: result.reason, match: result.match }],
    };
  }

  return { action: "allow", text: sanitized, reasons: [] };
}

module.exports = { inspectMessage };
