import robert from "robert";

/*
Tweet embeds
*/

export async function getTweetStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  const theme = options?.theme ?? "light";
  const direction = options?.direction ?? "ltr";
  const url = `https://platform.twitter.com/css/tweet.70d178496d6952c2c1b84d8c00695473.${theme}.${direction}.css`;
  const css = await robert.get(url).send("text");
  return formatTweetStyles(css, options);
}

export function formatTweetStyles(
  css: string,
  options?: {
    theme?: "light" | "dark";
    direction?: "ltr" | "rtl";
  }
): string {
  // dark theme doesn't set the text color to white for some reason
  if (options?.theme === "dark") {
    css += ".EmbeddedTweet{color:white}";
  }

  return css;
}

/*
Profile timeline embeds
*/

export async function getProfileStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  const theme = options?.theme ?? "light";
  const direction = options?.direction ?? "ltr";
  const url = `https://platform.twitter.com/css/timeline.2fcb295ab98c2ce26f4cca0d2b2d0f48.${theme}.${direction}.css`;
  const css = await robert.get(url).send("text");
  return formatProfileStyles(css, options);
}

export function formatProfileStyles(
  css: string,
  options?: {
    theme?: "light" | "dark";
    direction?: "ltr" | "rtl";
  }
): string {
  // dark theme doesn't set the text color to white for some reason
  if (options?.theme === "dark") {
    css += ".timeline-Widget{color:white}";
  }

  return css;
}

/*
List embeds
NOTE: list styles are the same as profile styles for now
*/

export function getListStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  return getProfileStyles(options);
}