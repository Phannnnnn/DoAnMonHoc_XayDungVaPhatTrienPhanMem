import axios from "./axios.custom";

const UserRegister = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password }
    return axios.post(URL_API, data);
}

const CreateNewUser = (name, email, password, role) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password, role }
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

const GetInforUser = (_id) => {
    const URL_API = "/v1/api/getinfor";
    const data = { _id };
    return axios.get(URL_API, data);
}

export {
    UserRegister,
    UserLogin,
    GetListUser,
    GetInforUser,
    CreateNewUser
}
