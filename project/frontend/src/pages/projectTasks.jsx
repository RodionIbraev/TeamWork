import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProjectTasks() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/login');
          } else {
        const fetchProject = async () => {
            try {
                const responseProject = await axios.get(`http://127.0.0.1:8000/project/${projectId}`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setProject(responseProject.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const responseEmployees = await axios.get('http://127.0.0.1:8000/get-employees/', {
                headers: {
                  'token': sessionStorage.getItem("accessToken"),
                }
              });
                setEmployees(responseEmployees.data);
            } catch (error) {
                console.error('не получилось:', error);
            }
        };

        fetchProject();
        fetchEmployees();
    }}, [projectId]);

    if (!project) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const getEmployeeName = (creatorId) => {
        const creator = employees.find(employee => employee.id === creatorId);
        if (creator) {
            return `${creator.first_name} ${creator.last_name}`;
        }
        return 'Unknown';
    };

    return (
        <div>
            <h2>{project.name}</h2>
            <p>Описание: {project.description}</p>
            <p>Создан: {formatDate(project.created_at)}</p>
            <p>Создатель: {getEmployeeName(project.creator)}</p>
        </div>
    );
}

export default ProjectTasks;