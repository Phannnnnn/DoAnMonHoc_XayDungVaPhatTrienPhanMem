import axios from "./axios.custom";

const UserRegister = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password }

    return axios.post(URL_API, data);
}

export {
    UserRegister
}
