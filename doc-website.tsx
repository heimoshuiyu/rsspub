import React from "https://esm.sh/react@18.2.0";
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";

interface RouterDoc {
  name: string;
  jsDoc: {
    doc: string;
  };
}

const routers: RouterDoc[] = JSON.parse(
  await Deno.readTextFile(".doc_gen.json"),
);

console.log(routers);

const Home = () => {
  return (
    <html lang="zh">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>rsspub 路由文档</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/sakura.css/css/sakura.css"
          type="text/css"
        >
        </link>
      </head>
      <body>
        <header>
          <h1>rsspub 路由文档</h1>
        </header>
        <main>
          <h2>路由路径</h2>
          <p>
            假设源文件为 <code>routers/abc.ts</code>{" "}
            的路由，运行在默认本地 8888 端口，默认没有设置 URL 前缀，则其 URL 为
            {" "}
            <code>http://127.0.0.1:8888/abc.ts</code>
          </p>
          <h2>路由目录</h2>
          <ul>
            {routers.map((routerDoc) => (
              <li>
                <a href={`#${routerDoc.name}`}>
                  {routerDoc.jsDoc.doc.split("\n")[0]}
                </a>
              </li>
            ))}
          </ul>
          <h2>路由文档</h2>
          {routers.map((routerDoc) => (
            <section>
              <h3>
                <a id={routerDoc.name}>{routerDoc.jsDoc.doc.split("\n")[0]}</a>
              </h3>
              <p>
                {routerDoc.jsDoc.doc
                  .split("\n")
                  .filter((v) => v)
                  .slice(1)
                  .map((line) => (
                    <>
                      {line}
                      <br />
                    </>
                  ))}
                源文件路径{" "}
                <a href={`routers/${routerDoc.name}.ts`}>
                  routers/{routerDoc.name}.ts
                </a>
              </p>
            </section>
          ))}
        </main>
        <footer></footer>
      </body>
    </html>
  );
};

const html = ReactDOMServer.renderToString(<Home />);
await Deno.writeTextFile("index.html", html);
