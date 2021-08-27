require("dotenv").config();
const { initNeosBot } = require("./src/bot");
const { initBotCommon } = require("./src/bot_common");

const { NEOS_BOT_USERNAME, NEOS_BOT_PASSWORD, PORT = 5000 } = process.env;

async function main() {
  const bot = await initNeosBot(NEOS_BOT_USERNAME, NEOS_BOT_PASSWORD);
  initBotCommon(bot);
}

main();
