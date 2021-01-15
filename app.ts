import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
const { cwd, stdout, copy } = Deno;
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import {
  validate,
  required,
  isString,
  isEmail,
  match,
} from "https://deno.land/x/validasaur/mod.ts";

import { Product } from "./product.ts";
import { Cart } from "./cart.ts";
import { CartItem } from "./cartItem.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const products: Product[] = new Array<Product>();

const data = Deno.readTextFile("./assets/data/products.json");

data
  .then((response) => {
    return JSON.parse(response);
  })
  .then((jsonData) => {
    for (const element of jsonData) {
      products.push(element);
    }
  });

const router = new Router();
router
  .get("/", async (context) => {
    context.response.body = await renderFile(`${cwd()}/views/index.ejs`, {
      products,
    });
  })
  .get("/product", (context) => {
    context.response.body = JSON.stringify(products);
  })
  .get("/product/:id", async (context) => {
    const product = products.find((product) => product.id+"" ===""+ context.params.id);
    context.response.body = await renderFile(`views/detail.ejs`, {
      product,
    });
  })
  .get("/checkout", async (context) => {
    context.response.body = await renderFile(`views/checkout.ejs`, {});
  })
  .post("/checkout", async (context) => {
    const data = await context.request.body({ type: "json" }).value;
    console.log(data);
    let [passes, errors] = await validate(data, {
      email: [required, isEmail],
      vorname: [required, isString, match(/^[a-z]/)],
      nachname: [required, isString, match(/^[a-z]/)],
    });
    if (passes) {
      await context.state.session.set("cart", new Cart());
      context.response.body = {
        message: "Vielen Dank für die Bestellung",
        code: 0,
      };
    } else {
      let errorList = new Array();
      for (const [key, value] of Object.entries(errors)) {
        for (const [key, objvalue] of Object.entries(value)) {
          console.log(objvalue);
          errorList.push(objvalue);
        }
      }
      context.response.body = {
        message: "validation failed",
        code: 1,
        data: { errorList },
      };
    }
  })
  .get("/minicart", async (context) => {
    if ((await context.state.session.get("cart")) == undefined) {
      await context.state.session.set("cart", new Cart());
    }
    const cart = await context.state.session.get("cart");
    context.response.body = {
      data: { count: cart.Count(), total: cart.Total() },
    };
  })
  .get("/cart", async (context) => {
    if ((await context.state.session.get("cart")) == undefined) {
      await context.state.session.set("cart", new Cart());
    }
    const cart: Cart = await context.state.session.get("cart");
    context.response.body = await renderFile(`views/cart.ejs`, {
      cart,
    });
  })
  .get("/getCartItems", async (context) => {
    if ((await context.state.session.get("cart")) == undefined) {
      await context.state.session.set("cart", new Cart());
    }
    const cart: Cart = await context.state.session.get("cart");
    let cartItems = cart.cartItems;
    context.response.body = { data: { cartItems } };
  })
  .put("/cart/:id", async (context) => {
    console.log(context);
    if ((await context.state.session.get("cart")) == undefined) {
      await context.state.session.set("cart", new Cart());
    }
    const id = context.params.id;
    console.log("Product Id: ", id);
    const cart: Cart = await context.state.session.get("cart");
    const index = products.findIndex((p) => p.id +"" ===""+ id);
    let product: Product = products[index];
    let inCart: number = cart.cartItems.findIndex((c) => c.product.id +"" === ""+ id);
    if (inCart == -1) {
      cart.cartItems.push(new CartItem(1, product));
    } else {
      const cartItem: CartItem = cart.cartItems[inCart];
      cartItem.count++;
    }
    context.response.body = {
      msg: `added product ${product.productName}`,
      data: { count: cart.Count(), total: cart.Total() },
    };
  })
  .patch("/cart/:id", async (context) => {
    const id = context.params.id;
    const cart: Cart = await context.state.session.get("cart");
    const index = products.findIndex((p) => p.id  +"" === ""+ id);
    let product: Product = products[index];
    let inCart: number = cart.cartItems.findIndex((c) => c.product.id  +"" === ""+ id);
    const cartItem: CartItem = cart.cartItems[inCart];
    if (cartItem.count > 1) {
      cartItem.count--;
    } else {
      cart.cartItems.splice(inCart, 1);
    }
    context.response.body = {
      msg: `removed product ${product.productName}`,
      data: { count: cart.Count(), total: cart.Total() },
    };
  });
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/assets`,
  });
});

await app.listen({ port: 8000 });