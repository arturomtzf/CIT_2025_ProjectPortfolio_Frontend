import { jwtDecode } from "jwt-decode";

export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

export const isTokenValid = (token) => {
    try {
        const { exp } = jwtDecode(token);
        console.log(jwtDecode(token))
        return exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const getUserName = (token) => {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
};