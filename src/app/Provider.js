const { pool } = require("../../config/database");
const Dao = require("./Dao");

exports.getChannelDataWithChannelId = async function (channelId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await Dao.getChannelDataWithChannelId(connection, channelId);
  connection.release();
  return result;
};


exports.getClubListWithChannelId = async function (channelId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await Dao.getClubListWithChannelId(connection, channelId);
  connection.release();
  return result;
}

exports.getClubDataWithClubId = async function (clubId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await Dao.getClubDataWithClubId(connection, clubId);
  connection.release();
  return result;
}

exports.getRankingForClub = async function (clubId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await Dao.getRankingForClub(connection, clubId);
  connection.release();
  return result;
}