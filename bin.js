const yargs = require("yargs");
const { spawnSync } = require("child_process");

const { argv } = yargs
  .command("$0 [cmd] <root>", "Start up Nuxt-ts server", (y) => {
    y
    .positional("cmd", {
      describe: "Command to pass to Nuxt-ts via Yarn",
      default: "dev"
    }).positional("root", {
      describe: "Root folder to scan (Must have config.yaml and data/)"
    });
  })
  .help();

process.env.ROOT = argv.root;

spawnSync("yarn", [argv.cmd], {
  stdio: "inherit"
});