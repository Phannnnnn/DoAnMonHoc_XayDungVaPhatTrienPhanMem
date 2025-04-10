import { data } from "react-router-dom";
import axios from "./axios.custom";

const GetQrUrl = async (vnp_Amount, orderInfo, vnp_ReturnUrl) => {
    const URL_API = "/v1/api/get-payment";
    return axios.get(URL_API, {
        params: { vnp_Amount, orderInfo, vnp_ReturnUrl }
    });
};
export {
    GetQrUrl
}
