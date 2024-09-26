import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload,admin } = await authenticate.webhook(request);

  switch (topic) {
    case "ORDERS_CREATE":
      console.log("---order created----");
      console.log("orders/create: ", payload);
      console.log("---order created----");
      break;
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      console.log("---app uninstalled----");
      
      break;
    case "PRODUCTS_CREATE":
        console.log("---product created----");
        console.log("products/create: ", payload);
        console.log("---product created----");
        break;
    case "DRAFT_ORDERS_UPDATE":
        console.log("---draft order created or updated----");
        console.log("draft_order/create: ", payload.admin_graphql_api_id);
        console.log("draft_order/create: ", payload.name);
        console.log("---draft order created or updated----");
        break;
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
