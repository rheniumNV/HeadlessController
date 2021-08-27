const { find } = require("lodash");
const context = require("./index");

exports.getFriendUser = (userId) => {
  const friendUser = find(
    context.neos.CloudXInterface.Friends.friends,
    (friend) => friend.Value.FriendUserId === userId,
  );
  return friendUser ? friendUser.Value : null;
};
