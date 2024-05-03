import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TaskCreate from '../components/task-create.jsx';
import '../styles/project-tasks.css';
import { User } from 'phosphor-react';
import { BsExclamationCircle, BsCalendar2Check } from "react-icons/bs";
import { Helmet } from 'react-helmet';

function ProjectTasks() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [statusNames, setStatusNames] = useState([]);
    const [showTaskCreate, setShowTaskCreate] = useState(false);

    useEffect(() => {
        const fetchTaskChoices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-task-choices/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setStatusNames(response.data.status_names);
            } catch (error) {
                console.error('Error fetching task choices:', error);
            }
        };

        fetchTaskChoices();
    }, []);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const [responseProject, responseEmployees] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/project/${projectId}`, {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/get-employees/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    })
                ]);
                setProject(responseProject.data);
                setEmployees(responseEmployees.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    if (!project || statusNames.length === 0) {
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

    const groupTasksByStatus = () => {
        const groupedTasks = {};

        statusNames.forEach(status => {
            groupedTasks[status] = project.tasks.filter(task => task.status === status);
        });

        return groupedTasks;
    };

    const groupedTasks = groupTasksByStatus();

    return (
        <div className='project-tasks'>
            <Helmet>
                <title>Задачи проекта "{project.name}"</title>
            </Helmet>
            <h2>{project.name}</h2>
            <p>Описание: {project.description}</p>
            <p>Создан: {formatDate(project.created_at)}</p>
            <p>Создатель: {getEmployeeName(project.creator)}</p>

            <button onClick={() => setShowTaskCreate(true)}>Создать задачу</button>

            {showTaskCreate && <TaskCreate />}

            <div className='status-card-all'>
                {statusNames.map(status => (
                    <div key={status} className='status-card'>
                        <div className='status-name'>{status}</div>
                        {groupedTasks[status].map(task => (
                            <div key={task.id} className={task.priority === 'Важный' ? 'task-card high' : task.priority === 'Срочный' ? 'task-card highest' : 'task-card default'}>
                                <h4>{task.name}</h4>
                                <div className="task-info">
                                    <div className="parent-element">
                                        <BsCalendar2Check size={25} weight="bold"/>
                                        <p>{formatDate(task.deadline)}</p>
                                    </div>
                                    <div className="parent-element">
                                        <BsExclamationCircle size={25} weight="bold"/>
                                        <p>{task.priority}</p>
                                    </div>
                                    <div className="parent-element">
                                        <User size={25} weight="bold"/>
                                        <p>{getEmployeeName(task.executor_id)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectTasks;