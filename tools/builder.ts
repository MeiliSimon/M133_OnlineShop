const [diagnostics, emit] = await Deno.bundle("./appCart.ts");

await Deno.writeTextFile("./assets/js/appCart.js", emit);
