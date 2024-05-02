import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import '../styles/project-create.css'

function ProjectCreate() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        employee: []
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-employees/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchEmployeeData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));

        setFormData(prevFormData => ({
            ...prevFormData,
            employee: selectedOptions
        }));
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || formData.employee.length === 0) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/project/create", formData, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            toast.success("Проект успешно создан");

            setTimeout(() => {
                navigate("/projects");
            }, 2000);

            console.log("Success!", response.data);
        } catch (error) {
            console.log("Error:", error.response?.data);
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {
                    const errorMessage = error.response.data[field];
                    if (errorMessage && errorMessage.length > 0) {
                        errorMessage.forEach(msg => {
                            toast.error(msg);
                        });
                    }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

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
            <Helmet>
                <title>Создание проекта</title>
            </Helmet>
            <form method="post" className="form">
                <div className="inputs">
                    <label htmlFor="name">Название:</label><br /><br />
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="description">Описание:</label><br /><br />
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="employee">Сотрудники:</label><br /><br />
                    <select multiple name="employee" id="employee" value={formData.employee} onChange={handleSelectChange} required>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {`${employee.first_name} ${employee.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btnSubmit" disabled={isLoading} onClick={handleSubmit}>Создать проект</button>
            </form>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default ProjectCreate;