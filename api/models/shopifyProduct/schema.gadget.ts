import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://tc-movie-db.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    movie: {
      type: "hasOne",
      child: { model: "movie", belongsToField: "product" },
      storageKey: "AlGTvryMI4gl",
    },
    oldDatabaseId: {
      type: "string",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "think_cinema_movies",
        key: "old_database_id",
        metafieldType: "single_line_text_field",
        allowMultipleEntries: false,
      },
      storageKey: "s0kocNdE7J9w",
    },
    productionYear: {
      type: "string",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "think_cinema_movies",
        key: "production_year",
        metafieldType: "single_line_text_field",
        allowMultipleEntries: false,
      },
      storageKey: "yEBq-7zSmgQj",
    },
    released: {
      type: "dateTime",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "think_cinema_movies",
        key: "released",
        metafieldType: "date",
        allowMultipleEntries: false,
      },
      includeTime: false,
      storageKey: "q7M9dliuVaUI",
    },
  },
  shopify: {
    fields: [
      "body",
      "category",
      "compareAtPriceRange",
      "featuredMedia",
      "handle",
      "hasVariantsThatRequiresComponents",
      "media",
      "options",
      "productCategory",
      "productType",
      "publishedAt",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "status",
      "tags",
      "templateSuffix",
      "title",
      "variants",
      "vendor",
    ],
  },
};
