const { createUserService } = require("../services/customerService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const data = await createUserService(name, email, password);
    res.status(200).json(data);
}

module.exports = {
    createUser
}