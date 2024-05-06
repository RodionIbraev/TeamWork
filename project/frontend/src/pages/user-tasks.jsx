import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/project-tasks.css';
import { BsExclamationCircle, BsCalendar2Check } from "react-icons/bs";
import { PiProjectorScreen } from "react-icons/pi";
import { FaInfoCircle, FaCommentDots } from "react-icons/fa";
import { Helmet } from 'react-helmet';
import TaskModal from '../components/task-modal.jsx';

function ProjectTasks() {
    
    const [employees, setEmployees] = useState([]);
    const [statusNames, setStatusNames] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const [responseStatusNames, responseEmployees, responseUserTasks, responseProjects] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/get-task-choices/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/get-employees/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/user/tasks/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/projects/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    })
                ]);
                setStatusNames(responseStatusNames.data.status_names);
                setEmployees(responseEmployees.data);
                setUserTasks(responseUserTasks.data);
                setProjects(responseProjects.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTaskData();
    }, []);

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

    const getProjectName = (projectId) => {
        const project = projects.find(project => project.id === projectId);
        return project ? project.name : 'Unknown';
    };

    const getTaskById = async (taskId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/task/${taskId}/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            setSelectedTask({ ...response.data, task_id: taskId });
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
    };

    return (
        <div className='project-tasks' style={{marginTop: '80px'}}>
            <Helmet>
                <title>Ваши задачи</title>
            </Helmet>
            <div className='status-card-all'>
                {statusNames.map(status => (
                    <div key={status} className='status-card'>
                        <div className='status-name'>{status}</div>
                        {userTasks.filter(task => task.status === status).map(task => (
                            <div key={task.id} className={task.priority === 'Важный' ? 'task-card high' : task.priority === 'Срочный' ? 'task-card highest' : 'task-card default'}>
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
                                        <PiProjectorScreen size={25} weight="bold" />
                                        <p>{getProjectName(task.project)}</p>
                                    </div>
                                    <div className="task-info-click">
                                        <FaCommentDots size={25}/>
                                        <FaInfoCircle size={25} onClick={() => handleTaskClick(task.id)}/>
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
                    showEditButton={false}
                    modalSize="small"
                />
            )}
        </div>
    );
}

export default ProjectTasks;
