const { getUser, sendMessage } = require("../../bot_common/operators");
const apiManager = require("../managers/apiManager");
const {
  generateSendBoothDataFromMessage,
} = require("../managers/boothManager");

const errorMessage = [
  "Bot Error",
  "しばらく待ってからお試しください。",
  "Please wait for a while and try again.",
  "잠시 후 시도해보십시오.",
].join("\n");

const genBoothLogic =
  (actionCode, generateSendBoothDataFunc, sendBoothAsyncFunc) =>
  async ({ message }, logger) => {
    try {
      const user = await getUser(message.SenderId);
      const sendBoothData = generateSendBoothDataFunc(message, user);
      logger.info(actionCode, sendBoothData);
      await sendBoothAsyncFunc(sendBoothData, logger);
    } catch (err) {
      logger.error(err);
      try {
        const result = await sendMessage(message.SenderId, errorMessage);
        logger.info("failure message", result);
      } catch (err2) {
        logger.error("failure message", err2);
      }
    }
  };

exports.createBooth = genBoothLogic(
  "create",
  (message, user) =>
    generateSendBoothDataFromMessage(
      message,
      user.Username,
      user.Profile.IconUrl,
    ),
  async (sendBoothData, logger) => {
    apiManager.createBooth(sendBoothData, logger);
  },
);

exports.updateBooth = genBoothLogic(
  "update",
  (message, user) =>
    generateSendBoothDataFromMessage(
      message,
      user.Username,
      user.Profile.IconUrl,
    ),
  async (sendBoothData, logger) => {
    apiManager.updateBooth(sendBoothData, logger);
  },
);

exports.infoUpdate = genBoothLogic(
  "infoUpdate",
  (message, user) =>
    generateSendBoothDataFromMessage(
      message,
      user.Username,
      user.Profile.IconUrl,
      false,
    ),
  async (sendBoothData, logger) => {
    apiManager.updateBooth(sendBoothData, logger);
  },
);
