import axios from "./axios.custom";

const GetCourseList = () => {
    const URL_API = "/v1/api/courselist";
    return axios.get(URL_API);
}


export {
    GetCourseList
}
