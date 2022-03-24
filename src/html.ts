import { LANG, TZ } from "./constants";

import { load } from "cheerio";
import robert from "robert";

export async function getTweet(
  id: string,
  options?: { theme?: "light" | "dark" }
) {
  const tweets = await getTweets([id], options);
  return tweets[id];
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
    .query("lang", LANG)
    .query("tz", TZ)
    .send("json");

  for (const id in json) {
    const html = json[id];
    json[id] = formatHtml(html);
  }

  return json;
}

export async function getTimeline(
  profile: string,
  options?: { theme?: "light" | "dark" }
): Promise<string> {
  const theme = options?.theme ?? "light";
  const json = await robert
    .get("https://syndication.twitter.com/timeline/profile.json")
    .query("screen_name", profile)
    .query("theme", theme)
    .query("lang", LANG)
    .query("tz", TZ)
    .send("json");

  return formatHtml(json.body);
}

export function formatHtml(html: string) {
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