import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload,admin } = await authenticate.webhook(request);

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      console.log("---app uninstalled----");
      
      break;
    case "DRAFT_ORDERS_UPDATE":
        console.log("---draft order created or updated----");
        console.log("draft_order/create: ", payload.admin_graphql_api_id);
        console.log("draft_order/create: ", payload.name);
        const draftOrderId = payload.admin_graphql_api_id
        const metafieldsQuery = 
        `{
          draftOrder(id: "${draftOrderId}") {
            id
            name
            metafields(first: 10) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  description
                }
              }
            }
          }
        }`;
        try {
            const response = await admin.graphql(metafieldsQuery);
            const responseJson = await response.json();
            // console.log(responseJson);
            const metafields = responseJson?.data?.draftOrder?.metafields?.edges?.map(edge => edge.node);
            console.log("---Draft Order Metafields----");
            console.log(metafields);
            console.log("---Draft Order Metafields Fetched----");
        } catch (error) {
            console.error("Error fetching metafields: ", error);
        }
        console.log("---draft order created or updated----");
        break;
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};