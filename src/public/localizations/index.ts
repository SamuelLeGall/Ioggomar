import _ from "lodash";
function createObjectStructure(
  path: string,
  value: string,
): Record<string, unknown> {
  // we exclude .json and the '' of the array
  const [cleanedPath] = path.split(".").filter((n) => n);
  const parts = cleanedPath.split("/").filter((n) => n);

  const resultingObject: Record<string, unknown> = {};
  //we generate an object with the localization tag as root parameters and the file name as a nested parameter (we ignore folder names)
  parts.reduce(function (obj, subObj) {
    if (subObj === parts[parts.length - 1]) {
      // we add the the file content inside the deepest key. It should be the fileName of the content we're adding.
      return (obj[subObj] = JSON.parse(value));
    } else if (subObj === parts[0]) {
      obj[subObj] = {};
      return obj[subObj] as Record<string, unknown>;
    } else {
      return obj as Record<string, unknown>;
    }
  }, resultingObject);

  return resultingObject;
}

export async function createCustomMessageObject(): Promise<
  Record<string, Record<string, unknown>>
> {
  //step1 : find all json files names under localization and subfolders
  const modules = import.meta.glob("./**/*.json");
  let res: Record<string, Record<string, unknown>> = {};

  //step2 : format data into final object
  for (const path in modules) {
    const filecontentAsModule = (await modules[path]()) as { default: unknown };
    const newStructure = createObjectStructure(
      path,
      JSON.stringify(filecontentAsModule.default),
    );

    //we fuse the structure generated for the current file analysed with the global final object structure
    res = _.merge(res, newStructure);
  }

  return res;
}
