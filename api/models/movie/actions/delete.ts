import { deleteRecord, ActionOptions, preventCrossShopDataAccess } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await preventCrossShopDataAccess(params, record);

  logger.info(`Deleting movie. Movie id: ${record.id}`);
  const movie = await api.movie.findById(record.id, {
    select: {
      id: true,
      actors: {
        edges: {
          node: {
            id: true
          }
        }
      },
      credits: {
        edges: {
          node: {
            id: true
          }
        }
      }
    }
  });

  try {
    const actors = movie.actors.edges.map(edge => edge.node.id);
    if (actors.length > 0)  {
      await api.actor.bulkDelete(actors);
      logger.info(`Deleted associated actors for mid: ${movie.id} - actor count: ${actors.length}`);
    }
    else {
      logger.warn(`No associated actors to delete for mid: ${movie.id}`);
    }

    const credits = movie.credits.edges.map(edge => edge.node.id);
    if (credits.length > 0) {
      await api.credit.bulkDelete(credits);
      logger.info(`Deleted associated credits for mid: ${record.id} - credit count: ${credits.length}`);
    }
    else {
      logger.warn(`No associated credits to delete for mid: ${movie.id}`);
    }

    await deleteRecord(record);
  }
  catch (error) {
    logger.error(`Failed to delete movie with id: ${record.id} - error: ${error}`);
  }
};

export const options: ActionOptions = {
  actionType: "delete",
};
