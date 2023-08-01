module.exports = {
    
    // Success
    SUCCESS: { "isSuccess": true, "code": 1000, "message": "success" },
    NOT_AUTHORIZED: { "isSuccess": false, "code": 1001, "message": "Invalid token" },
    WRONG_CHANNEL_ID: { "isSuccess": false, "code": 2001, "message": "Wrong channel" },
    WRONG_CLUB_ID: { "isSuccess": false, "code": 3001, "message": "Wrong club" },
    EMPTY_RECORD: { "isSuccess": false, "code": 3002, "message": "There is no record" },
    WRONG_USER_ID: { "isSuccess": false, "code": 4001, "message": "Wrong User" },
    INVALID_TIMESTAMP_OF_RECORD: { "isSuccess": false, "code": 5001, "message": "Invalid time" },
}