import { getTweets, getHtml, getStyles } from "./index";
import { writeFile } from "fs/promises";

(async () => {
  const styles = await getStyles({ theme: "dark" });
  const tweets = await getTweets(["1505810636676243457"], { theme: "dark" });
  const html = await getHtml(tweets["1505810636676243457"]);
  await writeFile("test.html", "<style>" + styles + "</style>" + html);
})();