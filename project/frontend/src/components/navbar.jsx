import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";
import axios from "axios";
import { useLocation } from 'react-router-dom';


export const Navbar = () => {
    const [firstName, setFirstName] = useState("");
    const [isLoggedin, setLoggedin] = useState("");
    
    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const response = await axios.get("http://127.0.0.1:8000/user-profile/", config);
                    setLoggedin(true);
                    setFirstName(response.data.first_name);
                } else {
                    setLoggedin(false);
                    setFirstName("");
                }
            } catch (error) {
                setLoggedin(false);
                setFirstName("");
            }
        };

        checkLoggedInUser();
    }, []);

    return (
        <div className="navbar">
            <div className="logo">
                <img src={logo} alt="" />
            </div>


            {isLoggedin ? (
                <p>{firstName}</p>
            ) : (
                <p></p>
            )}
        </div>
    );
};
