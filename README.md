# info

a tool to create static twitter embeds

stolen a little bit from notion's twitter embeds

gives you a static html and css to put in your own sites

# usage

example.ts creates html file for multiple twitter embeds

```ts
import {
  getTweet,
  getTweetStyles,
  getProfile,
  getProfileStyles,
  getList,
  getListStyles
} from "../src";

import { writeFile } from "fs/promises";
import { resolve } from "path";

(async () => {
  // https://twitter.com/CommandtechnoYT/status/1505810636676243457
  const tweet = await getTweet("1505810636676243457", { theme: "dark" });
  const tweetStyles = await getTweetStyles({ theme: "dark" });
  await writeFile(
    resolve(__dirname, "tweet.html"),
    "<style>" + tweetStyles + "</style>" + tweet
  );

  // https://twitter.com/CommandtechnoYT
  const timeline = await getProfile("CommandtechnoYT", { theme: "dark" });
  const timelineStyles = await getProfileStyles({ theme: "dark" });
  await writeFile(
    resolve(__dirname, "profile.html"),
    "<style>" + timelineStyles + "</style>" + timeline
  );

  // https://twitter.com/i/lists/715919216927322112
  const list = await getList("715919216927322112", { theme: "dark" });
  const listStyles = await getListStyles({ theme: "dark" });
  await writeFile(
    resolve(__dirname, "list.html"),
    "<style>" + listStyles + "</style>" + list
  );
})();
```

# output

tweet: https://commandtechno.github.io/static-twitter-embed/test/tweet.html

profile: https://commandtechno.github.io/static-twitter-embed/test/profile.html

list: https://commandtechno.github.io/static-twitter-embed/test/list.html