import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  if (record.oldDatabaseId) {
    // We have DVD Information for this product. Build a movie record for it.
    await api.movie.create({
      oldDatabaseId: record.oldDatabaseId,
      product: { _link: record.id }
    });
  }
};

export const options: ActionOptions = { actionType: "create" };
