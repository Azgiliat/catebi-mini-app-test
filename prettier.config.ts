import type { Config } from "prettier";
import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

const config: Config = {
  plugins: [prettierPluginTailwindcss],
};

export default config;
