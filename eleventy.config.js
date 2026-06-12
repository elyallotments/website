// Eleventy 3.x — ESM config. See MIGRATION.md / CLAUDE.md for project conventions.
export default function (eleventyConfig) {
  // Copy photos and downloadable docs straight through, preserving their
  // original paths so existing links keep working.
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Rebuild when CSS or JS changes (CSS is built by the Tailwind CLI separately).
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js/");

  // Current year, used in the footer.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
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
