exports.getChannelDataWithChannelId = async function (connection, channelId) {
  const Query = `
    SELECT id FROM ``10000_Channel`` WHERE id=?;
  `;
  const [result] = await connection.query(Query, channelId);
  return result;
};

exports.getClubListWithChannelId = async function (connection, channelId) {
  const Query = `
    select R.clubId, C.clubName, SUM(R.duration) as totalTime FROM ``10000_Record`` R
    INNER JOIN ``10000_Club`` C ON C.id = R.clubId
    WHERE C.channelId = ?
    GROUP BY R.clubId
  `;
  const [result] = await connection.query(Query, channelId);
  return result;
};

exports.getClubDataWithClubId = async function (connection, clubId) {
  const Query = `
  SELECT id FROM ``10000_Club`` WHERE id=?;
  `;
  const [result] = await connection.query(Query, clubId);
  return result;
};

exports.getUserDataWithUserId = async function (connection, userId) {
  const Query = `
  SELECT id FROM ``10000_User`` WHERE id=?;
  `;
  const [result] = await connection.query(Query, userId);
  return result[0];
};

exports.getRankingForClub = async function (connection, clubId) {
  const Query = `
  select U.id, U.nickname, SUM(R.duration) as totalTime FROM ``10000_Record`` R
  INNER JOIN ``10000_User`` U ON U.id = R.userId
  WHERE R.clubId = ?
  GROUP BY R.userId
  ORDER BY SUM(R.duration) desc
  `;
  const [result] = await connection.query(Query, clubId);
  return result;
};

exports.addRecord = async function (connection, params) {
  const Query = `
    INSERT INTO ``10000_Record`` (userId, clubId, startTime, endTime, duration) VALUES (?, ?, ?, ?, ?);
    `;
  const [result] = await connection.query(Query, params);
  return result;
};

exports.getEventDataTime = async function (connection, userId) {
  const Query = `
    SELECT clubId, SUM(duration) as time, date_format(startTime, '%Y-%m-%d') AS date FROM ``10000_Record`` 
    WHERE userId=?
    GROUP BY date_format(startTime, '%Y-%m-%d'), clubId
  `;
  const [result] = await connection.query(Query, userId);
  return result;
};

exports.getEventDataClubName = async function(connection, userId){
  const Query = `
    SELECT C.clubName, CUC.clubId FROM ``10000_Club`` C
    INNER JOIN ``10000_ClubUserConnection`` CUC ON C.id = CUC.clubId
    WHERE CUC.userId = ?
  `;
  const [result] = await connection.query(Query, userId);
  return result;
}

exports.getRankingByDate = async function(connection, date) {
  const Query =`
  SELECT userId, sum(duration) as duration, clubId FROM ``10000_Record`` WHERE date_format(startTime, '%Y-%m-%d') <= ?
  GROUP BY userId
  ORDER BY sum(duration) desc 
  `;
  const [result] = await connection.query(Query, date);
  return result;
}