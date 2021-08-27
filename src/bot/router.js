const { some } = require("lodash");
const util = require("util");
const { sendMessage } = require("../bot_common/operators");
const { genLogger } = require("../common/logger");
const boothController = require("./controllers/boothController");
const generalController = require("./controllers/generalController");
const { getRequestCode } = require("./helpers/messageHelper");

const MESSAGE_TYPE = {
  TEXT: "Text",
  OBJECT: "Object",
};

const genTrigger =
  (messageType, currentMessageType, requestCode, body, logger) =>
  (code, func) => {
    const routed = currentMessageType === messageType && requestCode === code;
    if (routed) {
      func(body, logger);
    }
    return routed;
  };

const genTriggers = (...args) => ({
  obj: genTrigger(MESSAGE_TYPE.OBJECT, ...args),
  cmd: genTrigger(MESSAGE_TYPE.TEXT, ...args),
});

module.exports = async (message, logger = genLogger()) => {
  try {
    const { MessageType, SenderId } = message;
    const requestCode = getRequestCode(message);

    const trigger = genTriggers(MessageType, requestCode, { message }, logger);

    const requestInfo = util.format(
      "(%s)%s from %s",
      MessageType,
      requestCode,
      SenderId,
    );

    logger.infoS("Route", requestInfo);

    const results = [
      trigger.obj("festa3/booth/create", boothController.createBooth),
      trigger.obj("festa3/booth/update", boothController.updateBooth),
      trigger.obj("festa3/booth/infoUpdate", boothController.infoUpdate),
      trigger.cmd("/hello", generalController.hello),
    ];

    if (!some(results)) {
      logger.warn("NoRouted", requestInfo);
    }
  } catch (err) {
    logger.error("Route", err);
    sendMessage(message.SenderId, "BotError");
  }
};
