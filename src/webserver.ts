import { Application, Router, send } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Product, ShoppingCart } from "./common/types.ts";

const app = new Application();
const router = new Router();

const session = new Session({ framework: "oak" });
await session.init();

const products:Product[] = JSON.parse(await Deno.readTextFile(`src/frontend/assets/products.json`));

router 
    //HTML
    .get("/", async (context) => {
        await send(context, "/src/frontend/index.html");
    })
    .get("/product/:id", async (context) => {
        await send(context, "/src/frontend/index.html");
    })
    .get("/shoppingcart", async (context) => {
        await send(context, "/src/frontend/index.html");
    })
    .get("/checkout", async (context) => {
        await send(context, "/src/frontend/index.html");
    })

    //Assets
    .get("/:mainfolder/:folder/:file", async (context) => {
        await send(context, "/src/frontend/" + context.params.mainfolder+ "/" + context.params.folder + "/" + context.params.file);
    })

    //API
    .get("/api/products", async (context) => {
        await send(context, "/src/frontend/assets/products.json");
    })
    .post("/api/shoppingcart/:id", async (context) => {
        const product = products.find(x => Number(x.id) === Number(context.params.id));

        if (!product) {
            context.response.status = 404;
            return;
        }

        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }

        let shoppingcart:ShoppingCart = await context.state.session.get("shoppingcart");

        await context.state.session.set("shoppingcart", [...shoppingcart.allProducts, product]);

        context.response.status = 200;
    })
    .post("/api/shoppingcart", async (context) => {
        let cart = await context.request.body({ type: "json" }).value;
        await context.state.session.set("shoppingcart", cart);

        context.response.status = 200
        context.response.body = { message: 'OK' }
    })
    .get("/api/shoppingcart", async (context) => {
        let cart = await context.state.session.get("shoppingcart");

        if (cart == undefined) {
            context.response.body = undefined;
        } else {
            context.response.body = cart;
        }
        context.response.status = 200;
    })
    .post("/api/order", async (context) => {
        context.response.status = 200
        context.response.body = { message: 'OK' }
    })

app.use(<any>session.use()(session));
app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");