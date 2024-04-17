/** works by merging the code with its driver to create a full
 * executable javascript code to be later send to piston api and be
 * executed
 */
export const JsCodeDriverFactory = (code: string, driver: string) => {
  const ANCHOR = "// #INSERT_HERE";
  return () => driver.replace(ANCHOR, code);
};
