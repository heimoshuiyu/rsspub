# rsspub

![doc CI](https://github.com/heimoshuiyu/rsspub/actions/workflows/doc-website.yml/badge.svg)
![lint CI](https://github.com/heimoshuiyu/rsspub/actions/workflows/lint.yml/badge.svg)
![routers CI](https://github.com/heimoshuiyu/rsspub/actions/workflows/routers.yml/badge.svg)

一个最简单的 RSS 生成工具。灵感来自
[RSSHub](https://github.com/DIYgod/RSSHub)。本项目因不满 RSSHub
的过度设计和巨大的 `node_modules`
依赖而创建，目标是提供一个简单易于开发的框架，满足用户使用 RSS
监视目标网站更新（而不是使用 RSS 阅读）的需求。

## 与 RSSHub 的区别

- rsspub 是全小写的
- rsspub 使用 deno 和 TypeScript，而 RSSHub 使用 node 而 JavaScript
- rsspub 对每个路由只需要一个文件（位于 `./routers` 文件夹中）
- rsspub 的 URL 风格为 `/xxx.ts`
- rsspub 仅生成能够让 RSS 客户端正常工作的最少字段（例如 `title`、 `link` 和
  `pubDate`），多余的字段（例如 `guid` 或 图片 等）是不需要的。这是故意设计
- rsspub 的目标是使用 RSS 对目标网站动态进行监控，而不是使用 RSS
  阅读目标网站上的内容。

## 运行

> 首先您需要在您的系统中安装 deno。参见 deno 安装教程:
> [官方](https://deno.land/manual@v1.31.2/getting_started/installation) 或
> [中国大陆镜像](https://x.deno.js.cn/)

运行 `deno task start` 或 `deno run -A main.ts`
即可启动。依赖将在首次运行时下载并缓存。

默认监听在本地 8888 端口，访问 <http://127.0.0.1/ping.ts> 即可得到对应路由的
RSS。路由位于 `routers/` 文件夹下，注意 URL 以 `.ts` 结尾。

### 配置

配置使用环境变量

- `RSSPUB_PREFIX` 路径前缀，默认为空，如果设置 `/api` 则所有路由格式变为
  `/api/xxx.ts`
- `RSSPUB_PORT` 监听端口，默认为 8888
- `RSSPUB_HOSTNAME` 监听地址，默认为空，表示所有地址

## 开发

> 建议使用 `vscode` 并安装 deno 扩展

### 新建路由

在 `./routers` 文件夹下新建一个 `.ts` 文件，从 `../main.ts` 中导入 `Context`
类型，并导出一个 async 函数作为该路由的 `handler`。基本格式如下

```typescript
import type { Context } from "../main.ts";
export default async function (ctx: Context) {
  ctx.state = {
    title: "...",
    link: "...",
    items: [],
  };
}
```

其中 `ctx.state` 是 `Feed` 类型（可在 `main.ts` 中找到），代表了需要返回的 RSS
信息。`main.ts` 中的中间件会将 `ctx.state` 渲染成 XML 格式并返回给 RSS 客户端

随后在 `main.ts` 文件中加载对应的路由到 router，因 deno deploy 暂不支持 dynamic import 所以这一步需要手动。
[TODO] 可以使用脚本完成这个动作

### 抓取网页

对于抓取网页 HTML 文本，您可以使用 deno 内建的 `fetch` API。例如

```typescript
const html = await fetch("https://example.org").then((resp) => resp.text());
```

或者如果目标网页使用 javascript 动态渲染内容，您可以使用 puppeteer
调起浏览器抓取 HTML

首先确保您的电脑中安装了 `chromium` 或 `firefox` 兼容的浏览器，然后运行
`deno run -A install-puppeteer.ts` 安装浏览器驱动。随后您可以使用 puppeteer
抓取网页

```typescript
import puppeteer from "puppeteer";
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("http://www.ragd.org.cn/ksjg");
const html = (await page.evaluate("document.body.innerHTML")) as string;
await browser.close();
```

### 解析网页

建议使用 `cheerio` 解析网页，相关例子可在 `routers/` 文件夹中找到

### 错误处理

应直接抛出错误或者放任它，oka 框架会向客户端返回 500 错误。

### 测试路由

运行 `deno task test` 或 `deno test -A test.ts` 将会测试 `routers/`
文件夹中的所有路由，包括类型检查和实际发起网络请求

### 格式化代码

```bash
deno fmt
```

### 生成路由文档

运行 `deno task doc` 将为 `./routers` 文件夹中的路由生成文档。文档是标准的
JavaScript 文档字符串。参见
[deno doc](https://deno.land/manual@v1.31.2/tools/documentation_generator)
