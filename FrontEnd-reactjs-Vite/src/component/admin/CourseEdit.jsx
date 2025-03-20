import { useParams } from "react-router-dom";

const CourseEdit = () => {

    const { id } = useParams();

    return < div >{id}</div >
}
export default CourseEdit;
