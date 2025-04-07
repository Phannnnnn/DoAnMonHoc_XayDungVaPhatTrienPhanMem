import { data } from "react-router-dom";
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

const passwordChance = (data) => {
    const URL_API = "/v1/api/password-chance";
    return axios.put(URL_API, data);
}

const UpdateUser = (updatedValues) => {
    const URL_API = `/v1/api/profile-update`;
    return axios.put(URL_API, updatedValues);
}

const GetListUser = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const GetListCourseByUser = (_id) => {
    const URL_API = `/v1/api/courselist/${_id}`;
    const data = { _id };
    return axios.get(URL_API);
}

const GetListCouserEnrolled = (_id) => {
    const URL_API = `/v1/api/get-courseslist-byuser`;
    const data = { _id };
    return axios.get(URL_API, { params: data });
}


const GetInforUser = (_id) => {
    const URL_API = "/v1/api/getinfor";
    const data = { _id };
    return axios.get(URL_API, { params: data });
}

export {
    UserRegister,
    UserLogin,
    UpdateUser,
    GetListUser,
    GetInforUser,
    CreateNewUser,
    passwordChance,
    GetListCourseByUser,
    GetListCouserEnrolled
}
