const context = require("./index");

exports.sendMessage = async (userId, message) => {
  const result = await context.neos.SendTextMessage(userId, message);
  return result;
};

exports.getMessages = async (userId) => {
  const { State, Content } =
    await context.neos.CloudXInterface.GetMessageHistory(userId);
  return State === 200 ? Content : null;
};

exports.getUser = async (userId) => {
  const { State, Content } = await context.neos.CloudXInterface.GetUser(userId);
  return State === 200 ? Content : null;
};

exports.friendRequest = async (userId) => {
  context.neos.CloudXInterface.Friends.AddFriend(userId);
};
