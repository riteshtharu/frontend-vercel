import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';


//
const UserContext = createContext();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 


    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:3000/api/auth/verify', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response.data.user);
                    

                    if (response.data.success) {
                        setUser(response.data.user); 
                    } else {
                       
                        localStorage.removeItem('token');
                        setUser(null);
                     ; 
                    }
                } 
            } catch (error) {
                console.log(error);
               
                if (error.response && !error.response.data.success) {
                    localStorage.removeItem('token');
                    setUser(null);
                    
                }
            } finally {
                setIsLoading(false); 
            }
        };

        verifyUser();
    }, []); 

    const login = (userData, token) => {
        setUser(userData); 
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); 

    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};


export const useAuth = () => useContext(UserContext);

export default AuthProvider;