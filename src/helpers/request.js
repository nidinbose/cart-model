import axios from "axios";

let token = localStorage.getItem("token");

export function getProfile(token) {
    if(token) {
        return axios.get("/api/profile",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

export function register(data) {
    return axios.post("/api/register", data);
}

export function login(data) {
    return axios.post("/api/login", data);
}

export function addProducts(data) {
    return axios.post("/api/add-products",data,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data"
        }
    });
}