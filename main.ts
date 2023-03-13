import * as oka from "https://deno.land/x/oak@v12.1.0/mod.ts";

export interface Feed {
  title: string;
  link: string;
  item: Item[];
}
export interface Item {
  title: string;
  link: string;
  pubDate: Date | undefined;
}

const app = new oka.Application();

const router = new oka.Router<Feed>({
  prefix: Deno.env.get("RSSPUB_PREFIX") ?? "",
});

/**
 * 定义了 RSS Feed 信息结构。
 *
 * 此类型用在中间件中传递数据。此结构故意设计为仅包含让 RSS 客户端能够正常运作的最少字段。
 *
 * 用例（可在 "./routers" 文件夹中找到）
 *
 * ```typescript
 * import type { Context } from "../main.ts"
 * export default async function (ctx: Context) {
 *     ...
 * }
 * ```
 */
export type Context = oka.RouterContext<
  string,
  Record<string | number, string>,
  Feed
>;

interface CacheItem {
  time: Date;
  feed: Feed;
}
const cache: Record<string, CacheItem> = {};
router.use(async (ctx, next) => {
  const now = new Date();
  if (
    cache[ctx.request.url.pathname] === undefined ||
    cache[ctx.request.url.pathname].time.valueOf() + 1000 * 60 * 60 <
      now.valueOf()
  ) {
    await next();
    cache[ctx.request.url.pathname] = { time: now, feed: ctx.state };
  }
  const ci = cache[ctx.request.url.pathname];
  ctx.response.headers.set("cached", ci.time.toISOString());
  const { feed } = ci;
  ctx.response.headers.set("Content-Type", "application/xml");
  ctx.response.body = `<rss version="2.0">
<channel>
<title>${feed.title.trim()}</title>
<link>${feed.link.trim()}</link>
${
    feed.item
      .map(
        (item) =>
          `<item>
  <title>${item.title.trim()}</title>
  <link>${item.link.trim()}</link>
  ${item.pubDate && `<pubDate>${item.pubDate.toUTCString()}</pubDate>`}
</item>`,
      )
      .join("")
  }
</channel>
</rss>`;
});

// import all routers
for await (const file of Deno.readDir("./routers")) {
  const mod = await import(`./routers/${file.name}`);
  router.get("/" + file.name, mod.default);
}

app.use(router.routes());

console.log("rsspub started");
await app.listen({
  port: parseInt(Deno.env.get("RSSPUB_PORT") ?? "8888"),
  hostname: Deno.env.get("RSSPUB_HOSTNAME"),
});
