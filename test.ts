Deno.test("路由测试", async (t) => {
  for await (const file of Deno.readDir("./routers")) {
    await t.step(file.name, async () => {
      const func = await import(`./routers/${file.name}`);
      try {
        await func.default({});
      } catch (e) {
        const errString: string = e.toString();
        if (errString.toLowerCase().includes("puppeteer")) {
          console.log(file.name, errString);
        } else {
          throw e;
        }
      }
    });
  }
});
