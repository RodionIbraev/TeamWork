import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TaskCreate from '../components/task-create.jsx';
import '../styles/project-tasks.css';
import { User } from 'phosphor-react';
import { BsExclamationCircle, BsCalendar2Check } from "react-icons/bs";
import { Helmet } from 'react-helmet';
import TaskModal from '../components/task-modal.jsx';

function ProjectTasks() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [statusNames, setStatusNames] = useState([]);
    const [showTaskCreate, setShowTaskCreate] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

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

    const getEmployeeName = (executorId) => {
        const executor = employees.find(employee => employee.id === executorId);
        if (executor) {
            return `${executor.first_name} ${executor.last_name}`;
        }
        return 'Unknown';
    };

    const getTaskById = async (taskId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/task/${taskId}/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            setSelectedTask({...response.data, task_id: taskId});
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    };

    const handleTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
        getTaskById(taskId);
    };

    const handleCloseModal = () => {
        setSelectedTaskId(null);
        setSelectedTask(null);
        setShowTaskCreate(null);
    };

    return (
        <div className='project-tasks'>
            <Helmet>
                <title>Задачи проекта "{project.name}"</title>
            </Helmet>
            <div className="task-btns">
                <button className='task-btn'>Список сотрудников</button>
                <button className='task-btn'>Экспорт в PDF</button>
                <button className='task-btn'>Экспорт в XLSX</button>
                <button className='task-btn' onClick={() => setShowTaskCreate(true)}>Создать задачу</button>
            </div>
            {showTaskCreate && (
                <TaskCreate 
                    onClose={handleCloseModal}
                />
            )}

            <div className='status-card-all'>
                {statusNames.map(status => (
                    <div key={status} className='status-card'>
                        <div className='status-name'>{status}</div>
                        {project.tasks.filter(task => task.status === status).map(task => (
                            <div key={task.id} className={task.priority === 'Важный' ? 'task-card high' : task.priority === 'Срочный' ? 'task-card highest' : 'task-card default'} onClick={() => handleTaskClick(task.id)}>
                                <h4>{task.name}</h4>
                                <div className="task-info">
                                    <div className="parent-element">
                                        <BsCalendar2Check size={25} weight="bold" />
                                        <p>{formatDate(task.deadline)}</p>
                                    </div>
                                    <div className="parent-element">
                                        <BsExclamationCircle size={25} weight="bold" />
                                        <p>{task.priority}</p>
                                    </div>
                                    <div className="parent-element">
                                        <User size={25} weight="bold" />
                                        <p>{getEmployeeName(task.executor_id)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {selectedTaskId && (
                <TaskModal
                    task={selectedTask}
                    formatDate={formatDate}
                    getEmployeeName={getEmployeeName}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}


export default ProjectTasks;