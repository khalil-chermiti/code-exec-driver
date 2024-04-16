export const JsCodeDriverFactory = (code: string, driver: string) => {
  const ANCHOR = "// #INSERT_HERE";
  return () => driver.replace(ANCHOR, code);
};
