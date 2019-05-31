require("isomorphic-fetch");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const dotenv = require("dotenv");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
const restartHeroku = require("./server/restart");

dotenv.config();
const logger = require("koa-logger");
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const Router = require("koa-router");
const { receiveWebhook } = require("@shopify/koa-shopify-webhooks");
const processPayment = require("./server/router");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  TUNNEL_URL,
  API_VERSION
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(logger());
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  router.get("/", processPayment);

  server.use(async (ctx, next) => {
    console.log("URL", ctx.request.url.split("?")[0]);
    console.log("SEARCH", ctx.request.querystring.split("&"));
    if (ctx.request.header.cookie) {
      if (
        (ctx.request.url.split("?")[0] === "/" &&
          ctx.request.querystring.split("&") &&
          ctx.request.querystring.split("&")[0].split("=")[0] === "hmac") ||
        (ctx.request.url.split("?")[0] === "/auth/callback" &&
          ctx.request.querystring.split("&") &&
          ctx.request.querystring.split("&")[1].split("=")[0] === "hmac")
      ) {
        {
          console.log("^ --------- DROP COOKIES ---------");
          ctx.request.header.cookie = ctx.request.header.cookie
            .split(" ")
            .filter(
              item =>
                ["koa:sess", "koa:sess.sig"].indexOf(item.split("=")[0]) === -1
            )
            .join(" ");
        }
      }
    }

    await next();
  });

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ["read_products", "write_products"],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, { httpOnly: false });
        const stringifiedBillingParams = JSON.stringify({
          recurring_application_charge: {
            name: "Recurring charge",
            price: 1.99,
            return_url: TUNNEL_URL
          }
        });

        const options = {
          method: "POST",
          body: stringifiedBillingParams,
          credentials: "include",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json"
          }
        };
        const confirmationURL = await fetch(
          `https://${shop}/admin/api/2019-04/recurring_application_charges.json`,
          options
        )
          .then(response => response.json())
          .then(
            jsonData => jsonData.recurring_application_charge.confirmation_url
          )
          .catch(error => console.log("error", error));
        ctx.redirect(confirmationURL);
      }
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post("/webhooks/redact", webhook, ctx => {
    console.log("received webhook: ", ctx.state.webhook);
  });

  server.use(graphQLProxy());
  router.get("*", verifyRequest(), async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
