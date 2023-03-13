import { app, router } from "./middleware.ts";
import type { Context } from "./middleware.ts";
export type { Context };

// import all routers
// [TODO] 因为 deno deploy 目前不支持动态导入所以这里手动写每一个路由
import ping from "./routers/ping.ts";
router.get("/ping.ts", ping);
import gdwxd from "./routers/gdwxd.ts";
router.get("/gdwxd.ts", gdwxd);
import fswxd from "./routers/fswxd.ts";
router.get("/fswxd.ts", fswxd);

app.use(router.routes());

console.log("rsspub started");
await app.listen({
  port: parseInt(Deno.env.get("RSSPUB_PORT") ?? "8888"),
  hostname: Deno.env.get("RSSPUB_HOSTNAME"),
});
