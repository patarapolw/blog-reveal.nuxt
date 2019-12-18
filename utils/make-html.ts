import showdown from "showdown";
import hyperpug, { IHyperPugFilters } from "hyperpug";
import h from "hyperscript";
import { createIndentedFilter } from "indented-filter";
import qs from "querystring";
// @ts-ignore
import scopeCss from "scope-css";
import cheerio from "cheerio";

export default class MakeHtml {
  pugExtensions: IHyperPugFilters;
  mdExtensions: Record<string, showdown.ShowdownExtension>;
  mdConverter: showdown.Converter;

  constructor() {
    this.pugExtensions = {};
    this.mdExtensions = {
      simpleTable: {
        type: "lang",
        filter(text) {
          const rowRegex = /(?:(?:^|\r?\n)(?:\| )?(?:(?:.* \| )+.+)*(?:.* \| )+.+(?: \|)?(?:$|\r?\n))+/m;
          text = text.replace(rowRegex, (p0) => {
            return h("table.table", p0.trim().split("\n").map((pi) => {
              pi = pi.trim().replace(/^|/, "").replace(/|$/, "");
              return h("tr", pi.split(" | ").map((x) => x.trim()).map((qi) => {
                return h("td", qi);
              }));
            })).outerHTML;
          });
          return text;
        }
      },
      pug: {
        type: "lang",
        filter: (s) => {
          return s.replace(/\/\/ nuxt\n```pug\n([^]+?)\n```/g, (p0: string, p1: string) => {
            return hyperpug.compile({ filters: this.pugExtensions })(p1);
          });
        }
      },
      css: {
        type: "lang",
        filter: (s) => {
          return s.replace(/\/\/ nuxt\n```css\n([^]+?)\n```/g, (p0: string, p1: string) => {
            return h("style", {attrs: {
              "data-content": p1
            }}).outerHTML;
          });
        }
      },
      // hr: {
      //   type: "lang",
      //   regex: /\r?\n===\r?\n/g,
      //   replace: "<hr/>"
      // },
      to: {
        type: "lang",
        filter: createIndentedFilter("^^to", (s, attrs) => {
          return h("a", { href: attrs.url }, s).outerHTML;
        })
      },
      spoiler: {
        type: "lang",
        filter: createIndentedFilter("^^spoiler", (s, attrs) => {
          return h("details", [
            ...(attrs.summary ? [
              h("summary", attrs.summary)
            ] : []),
            h("div", s)
          ]).outerHTML;
        })
      },
      speak: {
        type: "lang",
        filter: createIndentedFilter("^^speak", (s, attrs) => {
          return h("button.speak", {
            attrs: {
              type: "button",
              onclick: `speak('${attrs.s || s}', ${attrs.lang || ""})`
            }
          }, s).outerHTML;
        })
      },
      slide: {
        type: "lang",
        filter: createIndentedFilter("^^slide", (s, attrs) => {
          return h("a", {
            href: `https://patarapolw.github.io/reveal-md/reveal/?${qs.stringify({
              q: (() => {
                let q = s;
                if (attrs.github) {
                  q = `https://raw.githubusercontent.com/${attrs.github}/master/${s}`;
                }
                return q;
              })()
            })}`
          }, s).outerHTML;
        })
      }
    };
    this.mdConverter = new showdown.Converter();
    this.mdConverter.setFlavor("github");
    this.pugExtensions.markdown = (s) => {
      return this.mdConverter.makeHtml(s);
    };
    Object.entries(this.mdExtensions).forEach(([k, ext]) => this.mdConverter.addExtension(ext, k));
  }

  parse(s: string) {
    const html = this.mdConverter.makeHtml(s);
    return this.finalize(html);
  }

  mdConvert = this.parse;
  pugConvert(s: string) {
    const html = hyperpug.compile({ filters: this.pugExtensions })(s);
    return this.finalize(html);
  }

  finalize(s: string) {
    const $ = cheerio.load(s);
    $("style").each((_, el) => {
      const $el = $(el);
      const content = $el.attr("data-content");
      if (content) {
        $el.html(scopeCss(content, ".make-html-scoped"));
      }
    });

    return $.html();
  }
}