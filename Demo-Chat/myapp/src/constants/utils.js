export const validateMsg = (str) => {
  if (typeof str !== "string") return false;

  const trimmed = str.trim();

  if (trimmed === "" || trimmed.length > 50) return false;

  const regex = /^[\p{L}\p{N}@#$\s]+$/u;

  return regex.test(trimmed);
};
