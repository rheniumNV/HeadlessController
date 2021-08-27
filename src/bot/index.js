const Neos = require("@bombitmanbomb/neosjs");
const { onLogin, onFriendAdded, onMessageReceived } = require("./events");

exports.initNeosBot = async (username, password) => {
  const neos = new Neos();

  neos.on("login", onLogin(neos));
  neos.on("friendAdded", onFriendAdded(neos));
  neos.on("messageReceived", onMessageReceived(neos));

  await neos.Login(username, password);
  return neos;
};
