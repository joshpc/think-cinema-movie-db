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
      validations: { required: true },
      storageKey: "s0kocNdE7J9w",
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
