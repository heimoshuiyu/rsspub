import type { Context } from "../main.ts";

/**
 * 测试用例
 *
 * 随便返回一些数据
 */
export default async (ctx: Context) => {
  await new Promise((resolve) => setTimeout(() => resolve("asdf"), 39));
  ctx.state = {
    title: "test rss deno api endpoint",
    link: "localhost",
    item: [
      {
        title: "post tile",
        link: "https://example.org",
        pubDate: new Date("2007-08-31"),
      },
    ],
  };
};
