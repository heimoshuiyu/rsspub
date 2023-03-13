import puppeteer from "puppeteer";
import * as Cheerio from "cheerio";
import type { Context } from "../main.ts";

/**
 * 广东无线电考试结果
 * http://www.ragd.org.cn/ksjg
 */
export default async (ctx: Context) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://www.ragd.org.cn/ksjg");
  const html = (await page.evaluate("document.body.innerHTML")) as string;
  const $ = Cheerio.load(html);
  ctx.state = {
    title: "广东无线电考试结果",
    link: "http://www.ragd.org.cn/ksjg",
    item: $("div.w-al-unit.w-icon-hide")
      .map((_, item) => ({
        title: $("a.w-al-title", item).text().trim(),
        link: `http://www.ragd.org.cn${$("a.w-al-title").attr("href")}`,
        pubDate: new Date($("span.w-al-date", item).text().trim()),
      }))
      .get(),
  };
  await browser.close();
};
