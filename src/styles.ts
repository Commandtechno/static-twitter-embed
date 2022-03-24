import robert from "robert";

export function getTweetStylesUrl(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): string {
  const theme = options?.theme ?? "light";
  const direction = options?.direction ?? "ltr";
  // this hash doesn't seem to change but if it does i will find a better solution
  // without the hash, it leads to a different css
  return `https://platform.twitter.com/css/tweet.70d178496d6952c2c1b84d8c00695473.${theme}.${direction}.css`;
}

export async function getTweetStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  const url = getTweetStylesUrl(options);
  const css = await robert.get(url).send("text");
  return formatStyles(css, options);
}

export function getTimelineStylesUrl(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): string {
  const theme = options?.theme ?? "light";
  const direction = options?.direction ?? "ltr";
  // this hash doesn't seem to change but if it does i will find a better solution
  // without the hash, it leads to a different css
  return `https://platform.twitter.com/css/timeline.2fcb295ab98c2ce26f4cca0d2b2d0f48.${theme}.${direction}.css`;
}

export async function getTimelineStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  const url = getTimelineStylesUrl(options);
  const css = await robert.get(url).send("text");
  return formatStyles(css, options);
}

export function formatStyles(
  css: string,
  options?: {
    theme?: "light" | "dark";
    direction?: "ltr" | "rtl";
  }
) {
  // dark theme doesn't set the text color to white for some reason
  if (options?.theme === "dark") {
    css += ".EmbeddedTweet{color:white}";
  }

  return css;
}