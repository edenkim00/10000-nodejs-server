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
};

exports.getClubDataWithClubId = async function (clubId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await Dao.getClubDataWithClubId(connection, clubId);
  connection.release();
  return result;
};

exports.getUserDataWithUserId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [nicknameQueryResult, timeQueryResult, clubNameQueryResult] =
    await Promise.all([
      Dao.getUserDataWithUserId(connection, userId),
      Dao.getEventDataTime(connection, userId),
      Dao.getEventDataClubName(connection, userId),
    ]);
  const nickname = nicknameQueryResult.nickname;
  const dateList = getDateList(); // ['2023-08-02', ... ,'2023-08-08']

  const eventData = [];
  for (const clubData of clubNameQueryResult) {
    eventData.push({
      ...clubData,
      dateList: dateList,
      time: [0, 0, 0, 0, 0, 0, 0],
    });
  }

  /* clubNameQueryResult 이 다음과 같이 생김. (list of json)
   [
    {
      clubId: 1,
      clubName: '클럽1',
    },
    {
      clubId: 2,
      clubName: '클럽2',
    }
  ]
    */

  // 여기까지는 eventData
  // [
  //   {
  //     clubId: 1,
  //     clubName: '클럽1',
  //     dateList: ['2023-08-02','2023-08-03','2023-08-02',...,'2023-08-08' ]
  //     time: [0,0,0,0,0,0],

  //   },
  //   {
  //     clubId: 2,
  //     clubName: '클럽2',
  //     dateList: ['2023-08-02','2023-08-03','2023-08-02',...,'2023-08-08' ]
  //     time: [0,0,0,0,0,0],
  //   }
  // ]

  for (const timeData of timeQueryResult) {
    for (const data of eventData) {
      if (timeData.clubId == data.clubId) {
        data.time[dateList.indexOf(timeData.date)] += timeData.time;
        break;
      }
    }
  }

  const rankingQueryResult = [];
  for (const date of dateList) {
    rankingQueryResult.push(await Dao.getRankingByDate(connection, date));
  }
  for (const data of eventData) {
    data.ranking = [];
    for (let i = 0; i < 7; i++) {
      const records = rankingQueryResult[i].filter(
        (item) => item.clubId == data.clubId
      );
      const num = 1;
      for (const record of records) {
        if (userId == record.userId) {
          data.ranking.push(num);
          break;
        }
        num++;
      }
    }
  }
  return {
    nickname: nickname,
    eventData: eventData,
  };

  /*
    timeQueryResult 는 다음과 같이 생김. (list of Json)
    [
      {
        clubId: 1,
        time: 120,
        date: '2023-08-02',
      },
      {
        clubId: 1,
        time: 140,
        date: '2023-08-05',
      },
      {
        clubId: 2,
        time: 200,
        date: '2023-08-08',
      }
    ] 
  */

  connection.release();
  return result;
};

// 현재 날짜로부터 6일전 부터 오늘까지 yyyy-mm-dd 형식으로 7개의 string list 얻어오는 함수
function getDateList() {
  const dateList = [];
  for (let i = 0; i < 7; i++) {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - 6 + i);
    const day = targetDate.getDate().toString().padStart(2, "0");
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const year = targetDate.getFullYear().toString();
    dateList.push(`${year}-${month}-${day}`);
  }
  return dateList;
}
