// Eleventy 3.x — ESM config. See MIGRATION.md / CLAUDE.md for project conventions.
import { HtmlBasePlugin } from "@11ty/eleventy";

// Where the site is served. Empty/"/" locally; CI sets PATH_PREFIX (e.g. "/website/"
// for the GitHub Pages project URL https://elyallotments.github.io/website/).
const pathPrefix = process.env.PATH_PREFIX || "/";

export default function (eleventyConfig) {
  // Rewrites every root-relative URL in the output HTML (href/src/srcset...) to
  // include pathPrefix, so root-absolute links like /css/main.css and
  // /assets/uploads/... resolve correctly under a project subpath.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Copy photos and downloadable docs straight through, preserving their
  // original paths so existing links keep working.
  eleventyConfig.addPassthroughCopy({ "src/assets/uploads": "assets/uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/documents": "assets/documents" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  // Rebuild when CSS or JS changes (CSS is built by the Tailwind CLI separately).
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js/");

  // Current year, used in the footer.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Treat .html files as Nunjucks so we can use layouts/partials in them.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
