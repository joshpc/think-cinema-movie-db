import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  let productsBatch = await api.shopifyProduct.findMany({
    first: 50,
  });

  while (productsBatch.length > 0) {
    logger.info("Processing batch of products", { count: productsBatch.length } as any);

    for (const product of productsBatch) {
      if (product.oldDatabaseId) {
        try {
          const existingMovie = await api.movie.maybeFindByProduct(product.id);
          if (existingMovie) {
            logger.info("Found a match for product", { productId: product.id, oldDatabaseId: product.oldDatabaseId } as any);
            continue;
          }

          logger.info("Creating movie for product with oldDatabaseId", { productId: product.id, oldDatabaseId: product.oldDatabaseId } as any);
          await api.movie.create({
            oldDatabaseId: product.oldDatabaseId,
            product: { _link: product.id }
          });
        }
        catch (error: any) {
          logger.error("Error creating movie for product", error);
        }
      }
    }

    if (productsBatch.hasNextPage) {
      productsBatch = await productsBatch.nextPage();
    } else {
      break;
    }
  }
};

export const options: ActionOptions = {
  triggers: {
    api: true
  },
};
