const blacklistsBLL = require("../BLL/blacklistsBLL");

const createDOMPurify = require("isomorphic-dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// /* =================== Config =================== */
// const POLICY_PATH = path.join(__dirname, "..", "config", "policy.json");
// let POLICY = loadPolicy();

// function loadPolicy() {
//   try {
//     const raw = fs.readFileSync(POLICY_PATH, "utf8");
//     return JSON.parse(raw);
//   } catch (e) {
//     console.warn("policy.json missing/invalid; using safe defaults");
//     return {
//       failMode: "open",
//       cacheTTLSeconds: 86400,
//       expandShorteners: true,
//       googleWebRisk: {
//         enabled: true,
//         threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"]
//       }
//     };
//   }
// }
// // Re-load on file change
// fs.watch(POLICY_PATH, { persistent: false }, () => {
//   try { POLICY = loadPolicy(); console.log("policy reloaded"); } catch {}
// });

// /* =================== URL helpers =================== */
// const URL_RE = /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi;

// function extractUrls(text) {
//   const urls = [];
//   text.replace(URL_RE, (m) => { urls.push(m); return m; });
//   return urls;
// }

// function normalizeHost(host) {
//   return host.replace(/^www\./i, "").toLowerCase();
// }
// function getHostname(u) {
//   try { return normalizeHost(new URL(u).hostname); } catch { return null; }
// }

// // /* =================== Small cache (domain → verdict) =================== */
// // // Avoid external requests for every message with the same domain.
// // const verdictCache = new Map(); // host -> { action, reasons, expires }

// // function cacheGet(host) {
// //   const hit = verdictCache.get(host);
// //   if (!hit) return null;
// //   if (Date.now() > hit.expires) { verdictCache.delete(host); return null; }
// //   return { action: hit.action, reasons: hit.reasons };
// // }
// // function cacheSet(host, action, reasons) {
// //   const ttl = (POLICY.cacheTTLSeconds ?? 86400) * 1000;
// //   verdictCache.set(host, { action, reasons, expires: Date.now() + ttl });
// // }

// // /* =================== Expand short URLs =================== */
// // Follows redirects so we check the final destination with Web Risk.
// async function expandIfNeeded(url) {
//   if (!POLICY.expandShorteners) return url;
//   try {
//     const resp = await fetch(url, { method: "HEAD", redirect: "follow" });
//     if (resp && resp.url) return resp.url;
//   } catch (_) {
//     try {
//       const resp = await fetch(url, { method: "GET", redirect: "follow" });
//       if (resp && resp.url) return resp.url;
//     } catch { /* ignore */ }
//   }
//   return url;
// }

// /* =================== Google Web Risk threat check =================== */
// // Docs: https://cloud.google.com/web-risk/docs/reference/rest/v1/uris/search
// // GET https://webrisk.googleapis.com/v1/uris:search?threatTypes=...&uri=...&key=API_KEY
// async function checkWithWebRisk(url) {
//   if (!POLICY.googleWebRisk?.enabled) return { threat: "none" };

//   const key = process.env.WEB_RISK_API_KEY;
//   if (!key) {
//     console.warn("WEB_RISK_API_KEY missing; skipping Web Risk");
//     return { threat: "none" };
//   }

//   const tts = (POLICY.googleWebRisk.threatTypes || ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE"])
//     .map(t => `threatTypes=${encodeURIComponent(t)}`).join("&");

//   const endpoint = `https://webrisk.googleapis.com/v1/uris:search?${tts}&uri=${encodeURIComponent(url)}&key=${key}`;

//   try {
//     const r = await fetch(endpoint, { method: "GET" });
//     if (!r.ok) throw new Error(`webrisk status ${r.status}`);
//     const data = await r.json();

//     // If Web Risk returns threatTypes, this URL is on a bad list
//     if (data?.threat?.threatTypes?.length) {
//       return { threat: "malicious", types: data.threat.threatTypes };
//     }
//     return { threat: "none" };
//   } catch (e) {
//     console.warn("Web Risk error:", e.message);
//     // fail-open (allow) vs fail-closed (block) is policy-controlled
//     return POLICY.failMode === "closed" ? { threat: "unknown" } : { threat: "none" };
//   }
// }

// /* =================== DLP rules =================== */
// const DLP_RULES = [
//   // Block secrets (example: AWS Access Key)
//   { id: "aws_ak", type: "secret", action: "block",  re: /\bAKIA[0-9A-Z]{16}\b/g },

//   // Redact common PII
//   { id: "email",  type: "pii",    action: "redact", re: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}\b/g },
//   { id: "phone",  type: "pii",    action: "redact", re: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\d[-.\s]?){7,}\b/g },
// ];

// function redact(text, re) {
//   // Replace matches with asterisks (cap to 12 so it doesn't explode)
//   return text.replace(re, (m) => "*".repeat(Math.min(m.length, 12)));
// }

// // Combine actions, keeping the strictest (block > unknown > redact > allow)
// function worstAction(a, b) {
//   const rank = { allow: 0, redact: 1, unknown: 1.5, block: 2 };
//   return (rank[b] > rank[a]) ? b : a;
// }

// /* =================== Main inspect function =================== */
// async function inspectMessage(text) {
//   let action = "allow";        // allow | redact | block | unknown
//   const reasons = [];
//   let out = text;

//   // 1) URLs: expand, cache, Web Risk
//   const rawUrls = extractUrls(text);
//   const expanded = await Promise.all(rawUrls.map(expandIfNeeded));

//   for (const expandedUrl of expanded) {
//     const host = getHostname(expandedUrl);
//     if (!host) continue;

//     let verdict = cacheGet(host);
//     if (!verdict) {
//       const wr = await checkWithWebRisk(expandedUrl);
//       if (wr.threat === "malicious") {
//         verdict = { action: "block", reasons: [{ kind: "url_malicious", host, types: wr.types }] };
//       } else if (wr.threat === "unknown") {
//         verdict = {
//           action: (POLICY.failMode === "closed" ? "block" : "allow"),
//           reasons: [{ kind: "url_check_failed", host }]
//         };
//       } else {
//         verdict = { action: "allow", reasons: [{ kind: "url_ok", host }] };
//       }
//       cacheSet(host, verdict.action, verdict.reasons);
//     }

//     action = worstAction(action, verdict.action);
//     reasons.push(...verdict.reasons);
//     if (action === "block") break; // no need to continue
//   }

//   if (action === "block") return { action, text, reasons };

//   // 2) DLP: redact or block sensitive data in the text
//   for (const rule of DLP_RULES) {
//     if (!rule.re.test(out)) continue;
//     rule.re.lastIndex = 0;

//     if (rule.action === "block") {
//       action = worstAction(action, "block");
//       reasons.push({ kind: "dlp_block", rule: rule.id, type: rule.type });
//       break; // block is terminal
//     } else if (rule.action === "redact") {
//       out = redact(out, rule.re);
//       action = worstAction(action, "redact");
//       reasons.push({ kind: "dlp_redact", rule: rule.id, type: rule.type });
//     }
//   }

//   if (action === "redact") return { action, text: out, reasons };
//   if (action === "unknown") {
//     // Unknown only comes from Web Risk errors; respect failMode here
//     return POLICY.failMode === "closed"
//       ? { action: "block", text, reasons }
//       : { action: "allow", text, reasons };
//   }
//   return { action: "allow", text, reasons };
// }

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

  return { action: "allow", text: sanitized, reasons: [] };
}

module.exports = { inspectMessage };
