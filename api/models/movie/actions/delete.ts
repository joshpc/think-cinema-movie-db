import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  //First, delete the associated movie if there is one
  try {
    const movie = await api.movie.maybeFindByProduct(record.id)
    if (movie) {
      let success = await api.movie.delete(movie.id);
      logger.info(`Deleted associated movie pid:{record.id} - mid:{movie.id} - success:{success}`)
    }
  }
  finally {
    await deleteRecord(record);
  }
};

export const options: ActionOptions = {
  actionType: "delete",
};
