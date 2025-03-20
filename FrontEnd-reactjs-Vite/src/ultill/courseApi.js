import axios from "./axios.custom";

const GetCourseList = () => {
    const URL_API = "/v1/api/courselist";
    return axios.get(URL_API);
}

const CourseCreate = (name, description, course_img, price, teacher_id) => {
    const URL_API = "/v1/api/course-create";
    const data = { name, description, course_img, price, teacher_id }
    console.log("create course >> :", data);
    return axios.post(URL_API, data);
}

export {
    GetCourseList,
    CourseCreate
}
