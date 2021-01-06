import { Application,send ,Router } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Person } from "./common/types.ts";


// Session konfigurieren und starten
const session = new Session({ framework: "oak" });
await session.init();

const persons: Person[] = [
    { id: "p01", firstName: "Hans", lastName: "Maulwurf" }
];

const app = new Application();

const router = new Router();

router
.get("/", cxt => {
    return send(cxt, "/frontend/shop.html"); 
})
    .get("/api/persons", context => {
        context.response.body = persons;
    })
    .get("/api/persons/:id", async ctx => {
        ctx.response.body = persons
            .find(p => p.id == ctx.params.id);
    });

app.use(session.use()(session));
app.use(async cxt=>{
    await send(cxt,cxt.request.url.pathname,{ 
        root: `${Deno.cwd()}src/frontend`,
        index: "shop.html"

    });
});

console.log("Server running on http://localhost:8000");
app.listen({ port: 8000 });