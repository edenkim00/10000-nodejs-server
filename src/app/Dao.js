exports.getChannelDataWithChannelId = async function(connection, channelId) {
  const Query = `
    SELECT id FROM ``10000_Channel`` WHERE id=?;
  `;
  const [result] = await connection.query(Query, channelId);
  return result;
}

exports.getClubListWithChannelId = async function(connection, channelId) {
  const Query = `
    select R.clubId, C.clubName, SUM(R.duration) as totalTime FROM ``10000_Record`` R
    INNER JOIN ``10000_Club`` C ON C.id = R.clubId
    WHERE C.channelId = ?
    GROUP BY R.clubId
  `;
  const [result] = await connection.query(Query, channelId);
  return result;
}

exports.getClubDataWithClubId = async function(connection, clubId) {
  const Query = `
  SELECT id FROM ``10000_Club`` WHERE id=?;
  `;
  const [result] = await connection.query(Query, clubId);
  return result;
}

exports.getRankingForClub = async function(connection, clubId){
  const Query = `
  select U.id, U.nickname, SUM(R.duration) as totalTime FROM ``10000_Record`` R
  INNER JOIN ``10000_User`` U ON U.id = R.userId
  WHERE R.clubId = ?
  GROUP BY R.userId
  ORDER BY SUM(R.duration) desc
  `;
  const [result] = await connection.query(Query, clubId);
  return result;
}