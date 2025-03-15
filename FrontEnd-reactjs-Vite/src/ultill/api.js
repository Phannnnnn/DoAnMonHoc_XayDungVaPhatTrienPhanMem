import axios from "./axios.custom";

const UserRegister = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password }

    return axios.post(URL_API, data);
}

const UserLogin = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password }
    return axios.post(URL_API, data);
}

const GetListUser = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}


export {
    UserRegister,
    UserLogin,
    GetListUser
}
