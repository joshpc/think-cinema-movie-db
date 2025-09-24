import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "movie" model, go to https://tc-movie-db.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "4gHbU9wmLpVB",
  fields: {
    actors: {
      type: "hasManyThrough",
      sibling: { model: "person", relatedField: "acting_roles" },
      join: {
        model: "actor",
        belongsToSelfField: "movie",
        belongsToSiblingField: "person",
      },
      storageKey: "Np0EjOY2P4p8",
    },
    credits: {
      type: "hasManyThrough",
      sibling: { model: "person", relatedField: "credited_roles" },
      join: {
        model: "credit",
        belongsToSelfField: "movie",
        belongsToSiblingField: "person",
      },
      storageKey: "X4gfYoVFrlrm",
    },
    oldDatabaseId: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: 5, max: null },
        unique: true,
      },
      storageKey: "eAVSusaXaQ-f",
    },
    product: {
      type: "belongsTo",
      validations: {
        required: true,
        unique: { scopeByField: "oldDatabaseId" },
      },
      parent: { model: "shopifyProduct" },
      storageKey: "TQOgh5-uV07Y",
    },
  },
};
