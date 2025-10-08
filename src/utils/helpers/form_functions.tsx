export const normalizeKey = (key: string) =>
  key.trim().toLowerCase().replace(/\s+/g, "_");
