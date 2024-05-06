import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/login');
          } else {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/user-profile/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                        }
                });

                setUserData(response.data);
            } catch (error) {
            }
        };

        fetchData();
    }}, []);

    return (
        <div className="main">
            <Helmet>
                <title>Профиль пользователя</title>
            </Helmet>
            {userData && (
                <div>
                    <h2>User Profile</h2>
                    <p>ID: {userData.id}</p>
                    <p>Name: {userData.first_name} {userData.last_name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Post: {userData.post}</p>
                    <p>Date Joined: {new Date(userData.date_joined).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

