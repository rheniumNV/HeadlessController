require("dotenv").config();
const axios = require("axios");
const { format } = require("util");

const { FESTA_API_BASE_URL, API_X_API_KEY } = process.env;

exports.createBooth = async (body, logger = console) => {
  const { userId } = body;
  logger.infoS("send for create from %s", userId);
  const url = format("%s/v1/users/%s/booths/", FESTA_API_BASE_URL, userId);
  try {
    await axios.post(url, body, {
      headers: {
        "content-type": "application/json",
        "X-API-KEY": API_X_API_KEY,
      },
    });
    logger.infoS("success createBooth");
  } catch (err) {
    if (err.response.status >= 400 && err.response.status < 500) {
      logger.warn("create", err.response.status, err.response.data);
    } else {
      throw err;
    }
  }
};

exports.updateBooth = async (body, logger) => {
  const { userId, id } = body;
  logger.infoS("send for (info)update from %s %s", userId);
  const url = format(
    "%s/v1/users/%s/booths/%s/versions/",
    FESTA_API_BASE_URL,
    userId,
    id,
  );
  try {
    await axios.post(url, body, {
      headers: {
        "content-type": "application/json",
        "X-API-KEY": API_X_API_KEY,
      },
    });
    logger.infoS("success updateBooth");
  } catch (err) {
    if (err.response.status >= 400 && err.response.status < 500) {
      logger.warnS("update", err.response.status, err.response.data);
    } else {
      throw err;
    }
  }
};
