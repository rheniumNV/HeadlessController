const { genLogger, genCommonMessageGenerator } = require("../common/logger");
const router = require("./router");

exports.onLogin = (neos) => async () => {
  genLogger(genCommonMessageGenerator("Bot")).info(
    "logged in",
    neos.CloudXInterface.CurrentUser.Username,
  );
};

exports.onFriendAdded = (neos) => async (friend) => {
  if (friend.FriendStatus === "Requested") {
    neos.AddFriend(friend);
    genLogger(genCommonMessageGenerator("Bot")).info(
      "AcceptFriendRequest",
      friend.FriendUsername,
    );
  }
};

exports.onMessageReceived = (_neos) => async (message) => {
  const { SenderId, MessageType } = message;
  const logger = genLogger(genCommonMessageGenerator("Bot"));
  logger.infoS("ReceivedMessage(%s) from %s", MessageType, SenderId);
  router(message, logger);
};
