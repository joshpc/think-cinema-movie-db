import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "person" model, go to https://tc-movie-db.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "wPKyx3WnhPNH",
  fields: {
    acting_roles: {
      type: "hasMany",
      children: { model: "actor", belongsToField: "person" },
      storageKey: "EQZ5ULm37OBM",
    },
    birthYear: { type: "number", storageKey: "yJ4hOHyJPOeU" },
    credited_roles: {
      type: "hasMany",
      children: { model: "credit", belongsToField: "person" },
      storageKey: "ZyOWhE8Uk6GV",
    },
    firstName: {
      type: "string",
      validations: { required: true },
      storageKey: "qhf2s43y6gmJ",
    },
    handle: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "X5u51YFVl4uN",
    },
    lastName: { type: "string", storageKey: "E_Xl5oCCQi2k" },
    middleName: { type: "string", storageKey: "wWDppWCtYMdd" },
    movies_credits: {
      type: "hasManyThrough",
      sibling: { model: "movie", relatedField: "credits" },
      join: {
        model: "credit",
        belongsToSelfField: "person",
        belongsToSiblingField: "movie",
      },
      storageKey: "L5GcYnWb1V_0",
    },
    movies_roles: {
      type: "hasManyThrough",
      sibling: { model: "movie", relatedField: "actors" },
      join: {
        model: "actor",
        belongsToSelfField: "person",
        belongsToSiblingField: "movie",
      },
      storageKey: "iiS8HuvzhAgJ",
    },
  },
};
