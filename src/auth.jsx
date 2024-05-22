import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";

const Auth = () => {
    const [authUser, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
        setUser(user);
            }else{
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);
    return authUser;
};
export default Auth;