import type { Context } from "../main.ts";
import * as Cheerio from "cheerio";

/**
 * 佛山信息协会通知公告
 * http://www.fsiia.cn/wzgg/index.html
 */
export default async (ctx: Context) => {
  const home = "http://www.fsiia.cn/wzgg/index.html";
  const html = await fetch(home).then((resp) => resp.text());
  const $ = Cheerio.load(html);
  ctx.state = {
    title: "佛山市信息协会通知公告",
    link: home,
    item: $("div.listbox.blBor > ul.list > li")
      .map((_, item) => ({
        title: $("a", item).text().trim(),
        link: $("a", item).attr("href") ?? home,
        pubDate: new Date($("span", item).text().trim().slice(1, -1)),
      }))
      .get(),
  };
};
