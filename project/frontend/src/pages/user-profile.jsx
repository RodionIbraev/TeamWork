import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [photoData, setPhotoData] = useState(null);

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

const handlePhotoChange = (event) => {
    setPhotoData(event.target.files[0]);
};

const handleUploadPhoto = async () => {
    try {
        const formData = new FormData();
        formData.append('photo', photoData);

        await axios.patch('http://127.0.0.1:8000/user-profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': sessionStorage.getItem("accessToken"),
            }
        });
    } catch (error) {
    }
};

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/');
        } else {
            fetchData();
        }
    }, []);

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
            <input type="file" accept=".png" onChange={handlePhotoChange} />
            <button onClick={handleUploadPhoto} disabled={!photoData}>Загрузить</button>
        </div>
    );
};

