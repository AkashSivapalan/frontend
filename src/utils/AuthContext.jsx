import { useContext, useState, useEffect, createContext } from "react";
import {  toast } from 'react-toastify';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true); // Initially loading is true
    const [user, setUser] = useState(null);
    const regErr = () => toast.error("Email was taken!");
    const regSucc = ()=>toast.success("Registration Successful!")
    const LoginErr = () => toast.error("Invalid email/password!");
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/check-auth', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.status === 'ok') {
                    setUser(data.user);
                } else {
                    setUser(null); // Clear user state if not authenticated
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
                setUser(null); // Clear user state on error
            }
            setLoading(false);
        };
        checkAuth();
    }, []);
    
    const loginUser = async (userInfo) => {
        setLoading(true);

        try {
            const url = import.meta.env.VITE_REACT_APP_API_URL + '/login';

            const email = userInfo.email;
            const password = userInfo.password;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setUser(data.user); // Store user information in state
            } else {
                LoginErr()
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const logoutUser = async () => {
        try {
            const url = `${import.meta.env.VITE_REACT_APP_API_URL}/logout`;
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
            });
    
            if (res.ok) {
                setUser(null); 
            } else {
                console.error('Logout failed:', res.statusText);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    

    const registerUser = async (userInfo) => { 
        setLoading(true);
    
        try {
            const url = import.meta.env.VITE_REACT_APP_API_URL + '/register';
            const name = userInfo.name;
            const email = userInfo.email;
            const password = userInfo.password1;
    
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                })
            });
    
            const data = await res.json();
            if (res.ok) {
                regSucc();
            } else {
                regErr(data.error || 'Registration failed');
            }
        } catch (error) {
            console.log(error);
            regErr('Network error or server is down');
        }
    
        setLoading(false);
    };
    

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
        loading,
    };
     
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
