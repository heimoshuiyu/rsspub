const routers: string[] = [];
for await (const file of Deno.readDir("./routers")) {
  routers.push(file.name);
}

await Deno.writeTextFile(
  ".doc_gen.ts",
  routers
    .map(
      (name) =>
        `export {default as ${name.slice(0, -3)}} from "./routers/${name}"`,
    )
    .join("\n"),
);
