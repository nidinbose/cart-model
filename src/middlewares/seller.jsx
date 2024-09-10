import { Navigate } from "react-router-dom";
import { useContext } from "react";

import Loading from "../components/Loading";
import { GlobalContext } from "../context";

export function Seller({ children }) {
    let { getGlobal: { type } } = useContext(GlobalContext);
    if(!type) {
        return(<Loading />)
    }
    if(type !== "seller") {
        return <Navigate to={"/profile"} replace={true}> </Navigate>
    }
    return children;
}