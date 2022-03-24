import {
  getTweet,
  getTweetStyles,
  getTimeline,
  getTimelineStyles
} from "../src";
import { writeFile } from "fs/promises";
import { resolve } from "path";

(async () => {
  const tweet = await getTweet("1505810636676243457", { theme: "dark" });
  const tweetStyles = await getTweetStyles({ theme: "dark" });
  await writeFile(
    resolve(__dirname, "tweet.html"),
    "<style>" + tweetStyles + "</style>" + tweet
  );

  const timeline = await getTimeline("CommandtechnoYT", { theme: "dark" });
  const timelineStyles = await getTimelineStyles({ theme: "dark" });
  await writeFile(
    resolve(__dirname, "timeline.html"),
    "<style>" + timelineStyles + "</style>" + timeline
  );
})();