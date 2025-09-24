/*
  Takes a string, normalizes it and returns a string usable as a parameter/key.

  I.e. Banäna Phone -> banana_phone
      #!#!$!banana -> banana
*/
export function createHandle(value: string) {
  // Remove all non-alphanumeric characters except underscores
  let newValue = value.normalize("NFD").toLowerCase() //Extract all accents
  newValue = newValue.replace(/[-\s+]/g, "_");        //Replace spaces and dashes
  newValue = newValue.replace(/_{2,}/g, "_");         //Remove doubled underscores
  newValue = newValue.replace(/[^a-z0-9_]/g, "");     //Remove special characters
  newValue = newValue.replace(/^_+|_+$/g, "");        //Remove leading and trailing underscores
  return newValue
}

export function handleForPerson(actorOrCredit: any) {
  return createHandle(`${actorOrCredit.firstName || ""}-${actorOrCredit.middleName || ""}-${actorOrCredit.lastName || ""}${actorOrCredit.birthYear > 0 ? "-" + actorOrCredit.birthYear : ""}`)
}
