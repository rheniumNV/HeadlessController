const { sendMessage } = require("../../bot_common/operators");

exports.hello = async (message, logger) => {
  logger.infoS("hello", message);
  const { SenderId } = message;
  await sendMessage(SenderId, "hello!");
};
