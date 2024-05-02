import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/project-create.css';

function ProjectCreate() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!sessionStorage.getItem("accessToken")) {
                navigate('/login');
            } else {
                try {
                    const responseUserProfile = await axios.get('http://127.0.0.1:8000/user-profile/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    });
                    setUserProfile(responseUserProfile.data);
                    
                    if (responseUserProfile.data.post !== "Project manager") {
                        navigate('/error-not-authorized');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        checkAuthorization();
    }, [navigate]);

    if (userProfile && userProfile.post !== "Project manager") {
        return <p className='only-for'>Эта страница доступна только менеджерам проектов</p>;
    }

    return (
        <div>
        </div>
    );
}

export default ProjectCreate;