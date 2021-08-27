const {
  getHiddenMessageBody,
  getMessageBody,
} = require("../helpers/messageHelper");

exports.generateSendBoothDataFromMessage = (
  message,
  username,
  iconUrl,
  shouldUpdateObject = true,
) => {
  const body = getMessageBody(message);
  const { SenderId } = message;
  const { assetUri, thumbnailUri } = body;
  const { data } = getHiddenMessageBody(message);

  const sendBoothData = {
    ...data,
    ...{
      username,
      userId: SenderId,
      userIconUrl: iconUrl,
      thumbnailUrl: thumbnailUri,
    },
    ...(shouldUpdateObject
      ? {
          objectUrl: assetUri,
        }
      : {}),
  };

  return sendBoothData;
};
