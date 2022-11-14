import * as otpGenerator from "otp-generator";

export const getOrderId = () => {
    const uniqueNumber = otpGenerator.generate(5, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    const now = new Date();
    const year = now.getFullYear().toString().substr(2, 2);
    const month = now.getMonth() < 10 ? "0" + now.getMonth() : now.getMonth();
    const day = now.getDay() < 10 ? "0" + now.getDay() : now.getDay();
    const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    const second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    const unique = `NEK-${year}${month}-${day}${hour}${minutes}${second}-${uniqueNumber}`;
    return unique
}