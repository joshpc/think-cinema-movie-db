import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "actor" model, go to https://tc-movie-db.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "3nTxLrRxoOMK",
  fields: {
    creditedAs: { type: "string", storageKey: "qBfnAOxkIlty" },
    movie: {
      type: "belongsTo",
      parent: { model: "movie" },
      storageKey: "NYMD_vIp5JFe",
    },
    person: {
      type: "belongsTo",
      parent: { model: "person" },
      storageKey: "pfAYPWdQqB6k",
    },
    puppeteer: {
      type: "boolean",
      validations: { required: true },
      storageKey: "R3cN8wYBlz0J",
    },
    role: {
      type: "string",
      validations: { required: true },
      storageKey: "P7wAafK-Od4z",
    },
    uncredited: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "ACNXxtyZ0pGi",
    },
    voice: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "Kc2gsqejupio",
    },
  },
};
