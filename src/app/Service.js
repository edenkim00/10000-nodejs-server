const { pool } = require("../../config/database");
const Dao = require("./Dao");

exports.addRecord = async function (params) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const result = await Dao.getUserDataWithUserId(connection, params);
    connection.commit();
    return null;
  } catch (err) {
    console.error("addRecord Service error\n: ", err.message);
    await connection.rollback();
    // 6001
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

