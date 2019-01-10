import { terser } from "rollup-plugin-terser";
const plugins = [terser()];

export default [
  {
    input: "./src/index.js",
    plugins: plugins,
    output: {
      file: "build/leandb.esm.js",
      format: "es",
      name: "leandb"
    }
  },
  {
    input: "./src/index.js",
    plugins: plugins,
    output: {
      file: "build/leandb.min.js",
      format: "umd",
      name: "leandb"
    }
  }
];