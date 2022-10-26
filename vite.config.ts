import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import * as mdx from "vite-plugin-mdx";
import mdx from "@mdx-js/rollup";

console.log(mdx);
const options = {
  // See https://mdxjs.com/advanced/plugins
  remarkPlugins: [
    // E.g. `remark-frontmatter`
  ],
  rehypePlugins: [],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(options)],
  base: "/ts-featurizer-explainer/",
});
