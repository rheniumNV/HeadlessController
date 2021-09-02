require("dotenv").config();
const { NEOS_BOT_USERNAME, NEOS_BOT_PASSWORD, NEOS_PATH, ALLOWED_USER_LIST } =
  process.env;
const { spawn } = require("child_process");
const _ = require("lodash");
const Neos = require("@bombitmanbomb/neosjs");
const neos = new Neos();

let userId = null;
const userIdList = _.split(ALLOWED_USER_LIST, ",");

pattern = /^[^>]*>$/g;

var black = "\u001b[30m";
var red = "\u001b[31m";
var green = "\u001b[32m";
var yellow = "\u001b[33m";
var blue = "\u001b[34m";
var magenta = "\u001b[35m";
var cyan = "\u001b[36m";
var white = "\u001b[37m";

const neosHeadlessColor = "\u001b[36m";
const messageColor = "\u001b[32m";
const directInputColor = "\u001b[31m";
const systemMessageColor = "\u001b[35m";

var resetColor = "\u001b[0m";

let neosHeadless = null;

const makeNeosHeadless = () => {
  const app = spawn(`cd ${NEOS_PATH} && mono`, ["Neos.exe"], { shell: true });
  app.stdout.on("data", (data) => {
    const dataString = data.toString();
    console.log("NEOS_HEADLESS : ", neosHeadlessColor, dataString, resetColor);
    if (_.size(dataString) > 0 && userId != null) {
      console.log(">>>> Send to ", userId);
      neos.SendTextMessage(userId, dataString);
      userId = null;
    }
  });

  app.stderr.on("data", (data) => {
    console.log("STDERR", data.toString());
  });

  app.on("close", (code) => {
    console.log("CLOSE CODE", code);
  });
  return app;
};

neos.Login(NEOS_BOT_USERNAME, NEOS_BOT_PASSWORD);

neos.on("login", (obj) => {
  console.log(obj.CurrentUser, obj.CurrentSession);
});

process.stdin.on("data", (data) => {
  const dataString = data.toString();
  console.log("DIRECT_INPUT : ", directInputColor, dataString, resetColor);
  if (dataString == "startHeadless\n") {
    if (!neosHeadless || !neosHeadless.stdin || !neosHeadless.stdin.readable) {
      if (neosHeadless != null) {
        neosHeadless.kill();
      }
      neosHeadless = makeNeosHeadless(neosHeadless);
      console.log(systemMessageColor, "Headless is starting", resetColor);
    } else {
      console.log(
        systemMessageColor,
        "Headless has already started",
        resetColor
      );
    }
  } else if (_.size(dataString) > 0 && neosHeadless != null) {
    neosHeadless.stdin.write(dataString + "\n");
  } else {
    console.log(systemMessageColor, "Headless has not started", resetColor);
  }
});

neos.on("messageReceived", (message) => {
  console.log("NeosMessage: ", messageColor, message.Content, resetColor);
  if (_.includes(userIdList, message.SenderId)) {
    if (message.Content === "startHeadless") {
      if (
        !neosHeadless ||
        !neosHeadless.stdin ||
        !neosHeadless.stdin.readable
      ) {
        if (neosHeadless != null) {
          neosHeadless.kill();
        }
        neosHeadless = makeNeosHeadless(neosHeadless);
        neos.SendTextMessage(message.SenderId, "Headless is starting");
      } else {
        neos.SendTextMessage(message.SenderId, "Headless has already started");
      }
    } else if (neosHeadless != null) {
      neosHeadless.stdin.write(message.Content + "\n");
      userId = message.SenderId;
    } else {
      neos.SendTextMessage(message.SenderId, "Headless has not started");
    }
  } else {
    neos.SendTextMessage(message.SenderId, "Permission denied");
  }
});
