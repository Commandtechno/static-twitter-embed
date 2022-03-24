import { load } from "cheerio";
import robert from "robert";

export const [lang] = Intl.DateTimeFormat().resolvedOptions().locale.split("-"); // en
export const [, tz] = new Date().toTimeString().split(" "); // GMT-0500

export async function getStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string> {
  const theme = options?.theme ?? "light";
  const direction = options?.direction ?? "ltr";

  let css = await robert
    .get(
      `https://platform.twitter.com/css/tweet.70d178496d6952c2c1b84d8c00695473.${theme}.${direction}.css`
    )
    .send("text");

  // dark css doesn't set the color to white for some reason
  if (theme === "dark") {
    css += ".EmbeddedTweet{color:white}";
  }

  return css;
}

export async function getTweets<T extends string>(
  ids: T[],
  options?: { theme?: "light" | "dark" }
): Promise<{ [K in T]: string }> {
  const theme = options?.theme ?? "light";
  const json = await robert
    .get("https://syndication.twitter.com/tweets.json")
    .query("ids", ids.join(","))
    .query("theme", theme)
    .query("lang", lang)
    .query("tz", tz)
    .send("json");

  return json;
}

export async function getProfileTimeline(
  screenName: string,
  options?: { theme?: "light" | "dark" }
): Promise<string> {
  const theme = options?.theme ?? "light";
  const json = await robert
    .get("https://syndication.twitter.com/tweets.json")
    .query("screen_name", screenName)
    .query("theme", theme)
    .query("lang", lang)
    .query("tz", tz)
    .send("json");

  return json;
}

export function getHtml(html: string) {
  const $ = load(html);

  $("img").each((_, el) => {
    // tweet photos and video thumbnails
    const image = el.attribs["data-image"];
    if (image) {
      const imageUrl = new URL(image);
      imageUrl.searchParams.append("format", "jpg");
      imageUrl.searchParams.append("name", "small");
      el.attribs.src = imageUrl.toString();
      return;
    }

    // profile pictures
    const src =
      el.attribs["data-src"] ??
      el.attribs["data-src-1x"] ??
      el.attribs["data-src-2x"] ??
      el.attribs["data-src-4x"];

    if (src) {
      el.attribs.src = src;
      return;
    }
  });

  return $.html();
}