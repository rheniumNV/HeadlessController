const { split } = require("lodash");
const util = require("util");

const jsonParse = (json) => {
  try {
    return JSON.parse(
      json
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f"),
    );
  } catch (e) {
    throw util.format("%s str=%s", e, json);
  }
};
exports.getMessageBody = (message) => {
  const { Content } = message;
  return jsonParse(Content);
};

function getHiddenStr(str) {
  // eslint-disable-next-line no-unused-vars
  const [_1, teal] = split(str, "<size=0>");
  // eslint-disable-next-line no-unused-vars
  const [hiddenStr, _2] = split(teal, "</size>");
  return hiddenStr;
}

exports.getHiddenMessageBody = (message) => {
  const { MessageType, Content } = message;
  if (MessageType === "Object") {
    const content = jsonParse(Content);
    const { name } = content;
    return jsonParse(getHiddenStr(name));
  }
  return {};
};

exports.getRequestCode = (message) => {
  const { MessageType, Content } = message;

  switch (MessageType) {
    case "Text": {
      return Content;
    }
    case "Object": {
      const { requestCode } = this.getHiddenMessageBody(message);
      return requestCode;
    }
    default: {
      return "";
    }
  }
};
