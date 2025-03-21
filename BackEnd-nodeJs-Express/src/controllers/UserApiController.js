const { createUserService, userLoginService, getListUserService, getInforUserService } = require("../services/userService");

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

const getInforUser = async (req, res) => {
    const { _id } = req.body;
    const data = await getInforUserService(_id);
    res.status(200).json(data);
}

module.exports = {
    createUser,
    userLogin,
    getListUser,
    getAccount,
    getInforUser
}
