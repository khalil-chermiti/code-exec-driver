/** works by merging the code with its driver to create a full
 * executable javascript code to be later send to piston api and be
 * executed
 */
export const JsCodeDriver2Factory = (code: string, driver: string) => {
  const CODE_ANCHOR = "// #INSERT_HERE";
  const FUNCTION_NAME_ANCHOR = "#FUNCTION_NAME";

  return () => driver.replace(CODE_ANCHOR, code).replace(FUNCTION_NAME_ANCHOR, "main");
};
