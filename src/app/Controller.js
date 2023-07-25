const Provider = require("../app/Provider");
const Service = require("../app/Service");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");


require("dotenv").config();

// 회원가입
exports.postUser = async function (data, verifiedToken) {
    const { email, password, name, graduationYear, votingWeight } = data;

    // validation
    // 1001 : body에 빈값있음.
    if (email == null || password == null || name == null || graduationYear == null) {
        return errResponse(baseResponse.WRONG_BODY);
    }

    // 1002 : 이메일 검증
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (!regex.test(email)) {
        return errResponse(baseResponse.WRONG_EMAIL);
    }

    // 1003 : 비밀번호 길이 문제
    if (password.length < 4 || password.length > 12) {
        return errResponse(baseResponse.WRONG_PASSWORD_LENGTH);
    }

    // 1004 : 중복확인
    const doubleCheck = await Provider.getUserEmail(email);
    if (doubleCheck.length > 0) {
        return errResponse(baseResponse.ALREADY_EXIST_EMAIL);
    }

    // 1006: votingWeight은 4~8 사이의 정수
    if (votingWeight < 4 || votingWeight > 8) {
        return errResponse(baseResponse.WRONG_VOTING_WEIGHT);
    }

    // password 암호화
    const encoedPassword = Base64.stringify(hmacSHA512(password, process.env.PASSWORD_HASHING_NAMESPACE))

    const queryParams = [email, encoedPassword, name, graduationYear, votingWeight];
    await Service.postUser(queryParams);
    return response(baseResponse.SUCCESS);
};
