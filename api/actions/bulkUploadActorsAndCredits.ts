import { GadgetRecord, TcMovieDbClient } from ".gadget/client/types-esm";
import { handleForPerson } from "./utils/handleUtils";
import { CreatePersonVariables } from ".gadget/client/types-esm/models/Person";
import { ActionOptions } from ".gadget/server/dist-esm";

export const params = {
  dvds: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        actors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              middleName: { type: "string" },
              lastName: { type: "string" },
              birthYear: { type: "number" },
              role: { type: "string" },
              creditedAs: { type: "string" },
              voice: { type: "boolean" },
              uncredited: { type: "boolean" },
              puppeteer: { type: "boolean" }
            }
          }
        },
        credits: {
          type: "array",
          items: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              middleName: { type: "string" },
              lastName: { type: "string" },
              birthYear: { type: "number" },
              creditType: { type: "string" },
              creditSubtype: { type: "string" },
              creditedAs: { type: "string" },
            }
          }
        }
      }
    }
  }
};

async function getOrCreatePeople(api: TcMovieDbClient, actorsOrCredits: any[], handleToPeopleMap: Record<string, GadgetRecord<any>>) {
  let uniqueHandles = new Set<string>()
  let peopleToCreate: CreatePersonVariables[] = []

  for (let i=0; i<actorsOrCredits.length; ++i) {
    let actorOrCredit = actorsOrCredits[i]
    let handle = handleForPerson(actorOrCredit)
    if (uniqueHandles.has(handle)) {
      continue
    }
    uniqueHandles.add(handle)

    let person = await api.person.maybeFindByHandle(handle)
    if (person == null) {
      peopleToCreate.push({
        handle: handle,
        firstName: actorOrCredit.firstName,
        middleName: actorOrCredit.middleName,
        lastName: actorOrCredit.lastName,
        birthYear: actorOrCredit.birthYear
      })
    }
    else {
      handleToPeopleMap[handle] = person.id
    }
  }

  //If we have to create any, go ahead and then store references
  if (peopleToCreate.length > 0) {
    console.log(`Creating ${peopleToCreate.length} people: ${peopleToCreate.map(p => p.handle).join(", ")}`)
    try {
      let results = await api.person.bulkCreate(peopleToCreate, {
        select: {
          id: true,
          handle: true
        }
      })
      console.log(`  Created ${results.length} people`)
      for (let i=0; i<results.length; ++i) {
        let result = results[i]
        console.log(`    ${result.handle}: (${result.id})`)
        handleToPeopleMap[result.handle] = result.id
      }
    }
    catch (error) {
      console.error("Error creating people, failing early:", error)
      return
    }
  }

  return handleToPeopleMap
}

async function uploadActors(api: TcMovieDbClient, movie: GadgetRecord<any>, actors: any[], peopleMap: Record<string, any>) {
  //First get a handle on all of the people we need to create
  let handleToPeopleMap = await getOrCreatePeople(api, actors, peopleMap) || {}

  //Now, finally, go ahead and create all of the actors we need to!
  let actorsToCreate = []
  for (let i=0; i<actors.length; ++i) {
    let actorData = actors[i]
    let handle = handleForPerson(actorData)
    let actor = await api.actor.maybeFindFirst({
      filter: {
        movieId: { equals: movie.id },
        role: { equals: actorData.role },
        person: {
          handle: { equals: handle }
        }
      }
    })

    if (actor == null) {
      let mappedPerson = handleToPeopleMap[handle]
      if (mappedPerson == null) {
        return { success: false, error: new Error(`[Actor Upload] Movie: ${movie.id} was missing person: ${handle} and cannot be uploaded`) }
      }

      actorsToCreate.push({
        movie: {
          _link: movie.id
        },
        person: {
          _link: handleToPeopleMap[handle]
        },

        role: actorData.role,
        voice: actorData.voice,
        uncredited: actorData.uncredited,
        puppeteer: actorData.puppeteer,
        creditedAs: actorData.creditedAs
      })
    }
  }

  if (actorsToCreate.length > 0) {
    try {
      let results = await api.actor.bulkCreate(actorsToCreate, {
        select: {
          id: true
        }
      })

      return { success: true, created: results }
    }
    catch (error) {
      console.error("Error creating actors, failing early:", error)
      return { success: false, error: error }
    }
  }

  return { success: true };
}

async function uploadCredits(api: TcMovieDbClient, movie: GadgetRecord<any>, credits: any[], peopleMap: Record<string, any>) {
  //First get a handle on all of the people we need to create
  let handleToPeopleMap = await getOrCreatePeople(api, credits, peopleMap) || {}

  let creditsToCreate = []
  for (let i=0; i<credits.length; ++i) {
    let creditData = credits[i]

    let handle = handleForPerson(creditData)
    let credit = await api.credit.maybeFindFirst({
      filter: {
        movieId: { equals: movie.id },
        type: { equals: creditData.creditType },
        subtype: { equals: creditData.creditSubtype },
        person: {
          handle: { equals: handle }
        }
      }
    })

    if (credit == null) {
      let mappedPerson = handleToPeopleMap[handle]
      if (mappedPerson == null) {
        throw new Error(`[Credit Upload] Movie: ${movie.id} was missing person: ${handle} and cannot be uploaded`)
      }

      creditsToCreate.push({
        movie: {
          _link: movie.id
        },
        person: {
          _link: handleToPeopleMap[handle]
        },

        type: creditData.creditType,
        subtype: creditData.creditSubtype,
        creditedAs: creditData.creditedAs,
      })
    }
  }

  if (creditsToCreate.length > 0) {
    try {
      let results = await api.credit.bulkCreate(creditsToCreate, {
        select: {
          id: true
        }
      })

      return { success: true, created: results }
    }
    catch (error) {
      console.error("Error creating credits:", error)
      return { success: false, error: error }
    }
  }

  return { success: true };
}

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  let handleToPeopleMap: Record<string, GadgetRecord<any>> = {};
  let processedMovieIds: string[] = [];
  let actorsCreated = 0;
  let creditsCreated = 0;

  let dvds = params.dvds || []
  for (let i=0; i<dvds.length; ++i) {
    let dvd = dvds[i];
    if (dvd.id == null || dvd.title == null) {
      logger.warn(`Skipping DVD with no id or title - ${JSON.stringify(dvd)}`);
      continue;
    }

    // First, find the movie for this DVD
    logger.info(`Uploading actors and credits for ${dvd.id}: ${dvd.title}`);
    const movie = await api.movie.maybeFindByOldDatabaseId(dvd.id, {
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

    if (movie == null) {
      logger.warn(`No movie found for DVD ID ${dvd.id}`);
      continue;
    }

    processedMovieIds.push(movie.id);

    let actorResult = await uploadActors(api, movie, dvd.actors || [], handleToPeopleMap)
    if (actorResult.success) {
      logger.info(`${movie.id}: Uploaded actors. Created: ${actorResult.created?.length || 0}`)
      actorsCreated += actorResult.created?.length || 0
    }
    else {
      logger.error(`${movie.id}: Error uploading actors: ${actorResult.error}`)
      continue;
    }

    let creditResult = await uploadCredits(api, movie, dvd.credits || [], handleToPeopleMap)
    if (creditResult.success) {
      logger.info(`${movie.id}: Uploaded credits. Created: ${creditResult.created?.length || 0}`)
      creditsCreated += creditResult.created?.length || 0
    }
    else {
      logger.error(`${movie.id}: Error uploading credits: ${creditResult.error}`)
      continue;
    }
  }

  logger.info("Done processing actors and credits");

  return {
    success: true,
    dvdsProcessed: processedMovieIds,
    actorsUploaded: actorsCreated,
    creditsUploaded: creditsCreated
  }
};

export const options: ActionOptions = {
  timeoutMS: 900000, // 900 seconds (15 minutes) - maximum allowed
};
