export const [LANG] = Intl.DateTimeFormat().resolvedOptions().locale.split("-"); // en
export const [, TZ] = new Date().toTimeString().split(" "); // GMT-0500