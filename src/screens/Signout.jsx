import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { removeToken } from "../utils/tokenHelper"

const Signout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        removeToken();
        navigate("/");
    }, [])

    return null;
}

export default Signout;