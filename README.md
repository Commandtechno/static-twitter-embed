# info

a tool to create static twitter embeds

stolen a little bit from notion's twitter embeds

gives you a static html and css to put in your own sites

# usage

example.ts creates an html file with a tweet embed of https://twitter.com/CommandtechnoYT/status/1505810636676243457 in dark theme

```ts
import { getTweets, getHtml, getStyles } from "./index";
import { writeFile } from "fs/promises";

(async () => {
  const styles = await getStyles({ theme: "dark" });
  const tweets = await getTweets(["1505810636676243457"], { theme: "dark" });
  const html = await getHtml(tweets["1505810636676243457"]);
  await writeFile("test.html", "<style>" + styles + "</style>" + html);
})();
```

output:

![example output](https://cdn.discordapp.com/attachments/796997555752796184/956370087227559936/unknown.png)

# documentation

```ts
// returns the css that you need to include
export function getStyles(options?: {
  theme?: "light" | "dark";
  direction?: "ltr" | "rtl";
}): Promise<string>;

export function getTweets(
  ids: string[],
  options?: {
    theme?: "light" | "dark";
  }
): Promise<{ id: string }>;

export function getProfileTimeline(
  screenName: string,
  options?: { theme?: "light" | "dark" }
): Promise<string>;

// returns the full formatted html from getTweets or getProfileTimeline
export function getHtml(html: string): Promise<string>;
```