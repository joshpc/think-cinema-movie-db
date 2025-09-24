import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  let peopleBatch = await api.person.findMany({
    first: 50,
  });

  let problemNames = []

  while (peopleBatch.length > 0) {
    logger.info("Processing batch of people", { count: peopleBatch.length } as any);

    for (const person of peopleBatch) {
      let name = `${person.firstName || ""} ${person.middleName || ""} ${person.lastName || ""}`.trim();
      if (name.indexOf("�") >= 0) {
        logger.info("Person has invalid characters in name, please verify", { personId: person.id, name } as any);
        problemNames.push({
          name: name, personId: person.id
        });
      }
    }

    if (peopleBatch.hasNextPage) {
      peopleBatch = await peopleBatch.nextPage();
    }
    else {
      break;
    }
  }

  return problemNames
};

export const options: ActionOptions = {
  triggers: {
    api: true
  },
};
