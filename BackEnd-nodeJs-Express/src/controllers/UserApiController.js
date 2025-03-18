const { createUserService, userLoginService, getListUserService, getUserUservice } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const data = await createUserService(name, email, password);
    res.status(201).json(data);
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await userLoginService(email, password);
    res.status(200).json(data);
}

const getListUser = async (req, res) => {
    const data = await getListUserService();
    res.status(200).json(data);
}

const getAccount = async (req, res) => {
    res.status(200).json(req.user);
}

module.exports = {
    createUser,
    userLogin,
    getListUser,
    getAccount
}
