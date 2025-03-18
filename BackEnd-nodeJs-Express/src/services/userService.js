const User = require("../models/user");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;

//Dang ky tai khoan
const createUserService = async (name, email, password) => {
    try {
        //Kiem tra tai khoan da ton tai chua
        const user = await User.findOne({ email });
        if (user) {
            return "User da ton tai";
        }
        //Hash password
        const hashPass = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPass,
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

//Nguoi dung dang nhap
const userLoginService = async (email, password) => {
    try {
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatchPass = await bcrypt.compare(password, userLogin.password);

            if (!isMatchPass) {
                return {
                    Error: 'Email hoặc mật khẩu không hợp lệ!'
                }
            }
            else {
                const payload = {
                    name: userLogin.name,
                    email: userLogin.email,
                    role: userLogin.role
                }
                //Tao token
                const accessToken = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES
                    }
                );
                return { accessToken, userLogin, EC: 0 }
            }
        }
        else {
            return {
                Error: 'Email hoặc mật khẩu không hợp lệ!'
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Danh sach nguoi dung
const getListUserService = async () => {
    try {
        const userList = await User.find({}, { password: 0 });
        return userList
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createUserService,
    userLoginService,
    getListUserService
}
