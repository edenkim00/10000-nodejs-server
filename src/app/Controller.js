const Provider = require("../app/Provider");
const Service = require("../app/Service");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");

require("dotenv").config();

exports.getClubList = async function (data, verifiedToken) {
  const channelId = data.channelId;

  // validation
  if (!channelId) {
    return errResponse(baseResponse.WRONG_CHANNEL_ID);
  }
  // 2001 wrong channel-id
  const channelCheckData = await Provider.getChannelDataWithChannelId(
    channelId
  );
  if (channelCheckData.length < 1) {
    return errResponse(baseResponse.WRONG_CHANNEL_ID);
  }

  const result = await Provider.getClubListWithChannelId(channelId);
  return response(baseResponse.SUCCESS, result);
};

exports.getRankingForClub = async function (data, verifiedToken) {
  const clubId = data.clubId;

  //validation
  if (!clubId) {
    return errResponse(baseResponse.WRONG_CLUB_ID);
  }
  const clubCheckData = await Provider.getClubDataWithClubId(clubId);
  if (clubCheckData.length < 1) {
    return errResponse(baseResponse.WRONG_CLUB_ID);
  }

  const result = await Provider.getRankingForClub(clubId);
  if (result.length == 0) {
    return errResponse(baseResponse.EMPTY_RECORD);
  }
  return response(baseResponse.SUCCESS, result);
};

exports.addRecord = async function (data, verifiedToken) {
  const { clubId, startTime, endTime, userId } = data;

  if (!clubId) {
    return errResponse(baseResponse.WRONG_CLUB_ID);
  }
  if (!userId) {
    return errResponse(baseResponse.WRONG_USER_ID);
  }
  if (!(startTime && endTime && endTime > startTime)) {
    return errResponse(baseResponse.INVALID_TIMESTAMP_OF_RECORD);
  }

  const [clubCheckData, userData] = await Promise.all([
    Provider.getClubDataWithClubId(clubId),
    Provider.getUserDataWithUserId(userId),
  ]);

  if (clubCheckData.length < 1) {
    return errResponse(baseResponse.WRONG_CLUB_ID);
  }
  if (userData.length < 1) {
    return errResponse(baseResponse.WRONG_USER_ID);
  }
  const duration = Math.floor((endTime - startTime) / 1000);
  const result = await Service.addRecord([
    userId,
    clubId,
    startTime,
    endTime,
    duration,
  ]);

  if (result) {
    return result;
  } else {
    return response(baseResponse.SUCCESS);
  }
};
