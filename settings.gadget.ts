import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-07",
        enabledModels: [
          "shopifyFile",
          "shopifyProduct",
          "shopifyProductMedia",
          "shopifyProductOption",
          "shopifyProductVariant",
          "shopifyProductVariantMedia",
        ],
        type: "partner",
        scopes: [
          "write_products",
          "read_products",
          "read_metaobject_definitions",
          "read_metaobjects",
          "write_metaobjects",
          "unauthenticated_read_metaobjects",
        ],
      },
    },
  },
};
