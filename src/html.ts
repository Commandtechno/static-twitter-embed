import { LANG, TZ } from "./constants";

import { load } from "cheerio";
import robert from "robert";

const twitter = robert
  .client("https://syndication.twitter.com")
  .query("lang", LANG)
  .query("tz", TZ);

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
  const tweets = await twitter
    .get("/tweets.json")
    .query("ids", ids.join(","))
    .query("theme", theme)
    .send("json");

  for (const id in tweets) {
    const html = tweets[id];
    tweets[id] = formatHtml(html);
  }

  return tweets;
}

export async function getProfile(
  username: string,
  options?: { theme?: "light" | "dark" }
): Promise<string> {
  const theme = options?.theme ?? "light";
  const profile = await twitter
    .get("/timeline/profile.json")
    .query("screen_name", username)
    .query("theme", theme)
    .send("json");

  return formatHtml(profile.body);
}

export async function getList(
  id: string,
  options?: { theme?: "light" | "dark" }
) {
  // get profile name and slug from oembed
  const url = "https://twitter.com/i/lists/" + id;
  const oembed = await robert
    .get("https://publish.twitter.com/oembed")
    .query("url", url)
    .send("json");

  const [, username, , slug] = new URL(oembed.url).pathname.split("/");
  const list = await twitter
    .get("/timeline/list.json")
    .query("list_slug", slug)
    .query("screen_name", username)
    .send("json");

  return formatHtml(list.body);
}

export function formatHtml(html: string) {
  const $ = load(html);

  $("img").each((_, el) => {
    // emojis just need https
    const src = el.attribs.src;
    if (src) {
      if (src.startsWith("//")) {
        el.attribs.src = "https:" + src;
      } else {
        el.attribs.src = src;
      }
    }

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
    const dataSrc =
      el.attribs["data-src"] ??
      el.attribs["data-src-1x"] ??
      el.attribs["data-src-2x"] ??
      el.attribs["data-src-4x"];

    if (dataSrc) {
      el.attribs.src = dataSrc;
      return;
    }
  });

  return $.html();
}