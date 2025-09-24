import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  logger.info("Creating person", { handle: params.person?.handle } as any);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
