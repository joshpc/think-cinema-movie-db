import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "credit" model, go to https://tc-movie-db.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "rKM4sBRA5N4y",
  fields: {
    creditedAs: { type: "string", storageKey: "kS0VCrTQRY7U" },
    movie: {
      type: "belongsTo",
      parent: { model: "movie" },
      storageKey: "bt8BEL22tJGD",
    },
    person: {
      type: "belongsTo",
      parent: { model: "person" },
      storageKey: "JMquS6nccCMU",
    },
    subtype: {
      type: "string",
      validations: { required: true },
      storageKey: "rHEa_bwxC0uK",
    },
    type: {
      type: "string",
      validations: { required: true },
      storageKey: "LE5_pQ0YmQu8",
    },
  },
};
