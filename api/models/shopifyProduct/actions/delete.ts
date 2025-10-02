import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await preventCrossShopDataAccess(params, record);

  const movie = await api.movie.maybeFindByProduct(record.id, {
      select: {
        id: true
      }
    });

  if (movie) {
    await api.movie.delete(movie.id);
    logger.info(`Deleted associated movie with shopifyProduct pid:${record.id} - movieId:${movie.id}`);
  }
  else {
    logger.warn(`No movie associated with shopifyProduct pid:${record.id}`);
  }

  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: "delete" };
