import * as coda from "@codahq/packs-sdk";
import { deriveObjectSchema } from "./helper";

export const pack = coda.newPack();

/**
 * Coda plugin will only make request to the domain specified here
 * https://coda.io/packs/build/latest/reference/sdk/classes/core.PackDefinitionBuilder/#addnetworkdomain
 */
pack.addNetworkDomain("databar.ai");

/**
 * Invoke all methods using this authentication
 * https://coda.io/packs/build/latest/reference/sdk/classes/core.PackDefinitionBuilder/#setuserauthentication
 */
pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-APIKey",
  instructionsUrl: "https://databar.ai/send-feedback", //TOOD: Change this to correct API url
});

pack.addDynamicSyncTable({
  name: "databarTables",
  description: "Dynamic table that displays selected results from table ID specified.",
  listDynamicUrls: async function (context) {
    const { body } = await context.fetcher.fetch({
      method: "GET",
      url: "https://databar.ai/api/v3/tables",
    });
    const { results } = body;
    return (results || []).map((el: any) => ({
      display: el.name,
      value: `https://databar.ai/api/v3/tables/${el.id}`,
    }));
  },
  getName: async function (context) {
    const { body } = await context.fetcher.fetch({
      method: "GET",
      url: `${context.sync?.dynamicUrl}/` || "",
    });
    return body.name;
  },
  getSchema: async (context) => {
    let { body } = await context.fetcher.fetch({
      method: "GET",
      url: `${context.sync?.dynamicUrl}/columns`,
    });
    const data = (body || []).map((el: any) => ({
      [el.name]: "",
    }));

    const itemSchema = deriveObjectSchema(data, {
      properties: {
        itemId: { type: coda.ValueType.String },
      },
      id: "itemId",
      primary: "itemId",
    });

    itemSchema.featured = Object.keys(itemSchema.properties);

    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: itemSchema,
    });
  },
  getDisplayUrl: async (context) => {
    return context.sync?.dynamicUrl || "";
  },
  formula: {
    name: "SyncCatalog",
    description: "Sync your Databar table",
    parameters: [],
    execute: async function ([], context) {
      const { body: rowBody } = await context.fetcher.fetch({
        method: "GET",
        url: coda.withQueryParams(context.sync.dynamicUrl + "/rows"),
      });

      const { body: columnsBody } = await context.fetcher.fetch({
        method: "GET",
        url: coda.withQueryParams(context.sync.dynamicUrl + "/columns"),
      });
      const { result: rowResult } = rowBody;
      const columnsRowMapping = {};
      columnsBody.forEach((column) => {
        columnsRowMapping[column.internal_name] = column.name;
      });

      const data = rowResult.map((row) => {
        const { id } = row;
        const { data } = row;
        const newObj = {};
        Object.keys(data).forEach((el) => {
          const elMapping = columnsRowMapping[el];
          if (elMapping) {
            newObj[elMapping] = data[el];
          }
        });
        return { id, ...newObj };
      });
      return {
        result: data.map((data: any) => {
          return {
            ...data,
            itemId: data.id,
          };
        }),
      };
    },
  },
  identityName: "databarTables",
});
