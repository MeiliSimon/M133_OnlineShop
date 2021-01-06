const [diagnostics, emit] = await Deno.bundle(
    "./src/frontend/app.ts",
);

await Deno.writeTextFile("./src/frontend/build.app.js", emit);