import { deleteRecord, ActionOptions, preventCrossShopDataAccess } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await preventCrossShopDataAccess(params, record);
  logger.info(`Deleting credit id:${record.id} - movieId:${record.movieId}`);
  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
};
