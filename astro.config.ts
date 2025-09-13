import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkCallouts from "./src/utils/remark-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import path from "path";
import remarkDirective from 'remark-directive';
import { parseDirectiveNode } from "./src/utils/github-repo-card/remark-directive-rehype";
import { GithubCardComponent } from "./src/utils/github-repo-card/rehype-component-github-card";
import rehypeComponents from "rehype-components";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ['min-light', 'min-dark'],
      useDarkModeMediaQuery: true,
      themeCssSelector: (theme) => `[data-ec-theme='${theme.name}']`
    })
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkCallouts,
      remarkDirective,
      [parseDirectiveNode, {}],
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeMermaid,
      [
        rehypeComponents,
        {
          components: {
            github: (props: any, children: any[]) => GithubCardComponent(props, children),
          }
        }
      ],
    ],
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});