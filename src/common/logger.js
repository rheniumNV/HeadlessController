require("dotenv").config();
const { default: axios } = require("axios");
const { reduce } = require("lodash");
const util = require("util");
const moment = require("moment");

const {
  NOTICE_URL_ERROR,
  NOTICE_URL_WARN,
  NOTICE_URL_INFO,
  NOTICE_STR_MAX_LENGTH = 1980,
} = process.env;

const LogConfig = {
  error: {
    noticeUrl: NOTICE_URL_ERROR,
    logFunc: console.error,
  },
  warn: {
    noticeUrl: NOTICE_URL_WARN,
    logFunc: console.warn,
  },
  info: {
    noticeUrl: NOTICE_URL_INFO,
    logFunc: console.info,
  },
  errorS: {
    noticeUrl: undefined,
    logFunc: console.error,
  },
  warnS: {
    noticeUrl: undefined,
    logFunc: console.warn,
  },
  infoS: {
    noticeUrl: undefined,
    logFunc: console.info,
  },
  debug: {
    noticeUrl: undefined,
    logFunc: console.debug,
  },
};

exports.genRequestId = () =>
  util.format(
    "%s%d",
    moment().format("HHMMss"),
    Math.floor(Math.random() * 999),
  );

exports.genCommonMessageGenerator =
  (appType = "", requestId = this.genRequestId()) =>
  (...args) =>
    `${appType} rid=${requestId}: ${util.format(...args)}`;

function log(
  { logLevel, noticeUrl, logFunc = console.log },
  message,
  noticeMessage,
) {
  logFunc(util.format("[%s] %s", logLevel, message));

  if (noticeUrl && noticeUrl !== "") {
    (async () => {
      try {
        const slicedNoticeMessage = noticeMessage
          .toString()
          .substring(0, NOTICE_STR_MAX_LENGTH);
        await axios.post(noticeUrl, { content: slicedNoticeMessage });
      } catch (err) {
        console.error(
          "NoticeError logLevel=%s. message=%s error=%s",
          logLevel,
          message,
          util.inspect(err),
        );
      }
    })();
  }
}

exports.genLogger = (
  messageGenerator = this.genCommonMessageGenerator(),
  noticeMessageGenerator = messageGenerator,
) =>
  reduce(
    LogConfig,
    (prev, config, key) => ({
      ...prev,
      ...{
        [key]: (...args) =>
          log(
            { ...{ logLevel: key }, ...config },
            messageGenerator(...args),
            noticeMessageGenerator(...args),
          ),
      },
    }),
    {},
  );
