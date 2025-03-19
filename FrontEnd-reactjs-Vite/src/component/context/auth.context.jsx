import { createContext, useState } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: "",
        email: "",
        name: "",
        role: ""
    },
    loading: true
});


const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: "",
            email: "",
            name: "",
            role: ""
        },
        loading: false
    });

    const [loading, setLoading] = useState(false);


    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export {
    AuthContext,
    AuthWrapper
}