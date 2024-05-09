import React, { useState, useEffect } from 'react';
import '../styles/task-modal.css';
import axios from 'axios';
import { X } from 'phosphor-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const TaskModal = ({ task, formatDate, getEmployeeName, onClose, showEditButton}) => {
    const { projectId } = useParams ();
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [editableTask, setEditableTask] = useState(null);
    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState([]);
    const [executors, setExecutors] = useState([]);
    const [modalClass, setModalClass] = useState('task-modal');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableTask({ ...editableTask, [name]: value });
    };

    useEffect(() => {
        const fetchTaskChoices = async () => {
             try {
                const [responseTask, responseEmployees] = await Promise.all([
                axios.get('http://127.0.0.1:8000/get-task-choices/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                }),
                axios.get(`http://127.0.0.1:8000/get-employees/${projectId}`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                })
                ]);
                setPriorities(responseTask.data.priority_names);
                setCategories(responseTask.data.category_names);
                setStatus(responseTask.data.status_names);
                setExecutors(responseEmployees.data)

            } catch (error) {
                console.error('Ошибка загрузки вариантов задач:', error);
            }
        };

        fetchTaskChoices();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://127.0.0.1:8000/task/${editableTask.task_id}/update/`, editableTask, {
                headers: {
                    'token': sessionStorage.getItem('accessToken')
                }
            });

            toast.success("Задача успешно обновлена");
            setTimeout(() => {
                reloadPage();
            }, 2000);
        } catch (error) {
            console.log("Error:", error.response?.data);
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data)) {
                    error.response.data.forEach(msg => {
                        toast.error(msg);
                    });
                } else {
                    toast.error(error.response.data);
                }
            }
        }
    };

    const renderField = (label, value, name) => {
        if (editableTask) {
            if (name === 'description') {
                return (
                    <textarea
                        id='description-task-modal'
                        name={name}
                        value={editableTask[name]}
                        onChange={handleChange}
                    />
                );
            } else if (name === 'deadline') {
                return (
                    <input
                        type="datetime-local"
                        name={name}
                        value={formatDate(editableTask[name])}
                        onChange={handleChange}
                    />
                );
            } else if (name === 'priority' || name === 'category' || name === 'executor' || name === 'status') {
                return (
                    <select
                    name={name}
                    value={editableTask[name]}
                    onChange={handleChange}
                    >
                    {name === 'priority' && priorities.map((priority, index) => (
                        <option key={index} value={priority}>{priority}</option>
                    ))}
                    {name === 'category' && categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                    {name === 'executor' && executors.map((executor) => (
                       <option key={executor.id} value={executor.id}>{`${executor.first_name} ${executor.last_name}`}</option>
                    ))}
                    {name === 'status' && status.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            );
            } else {
                return (
                    <input
                        type="text"
                        name={name}
                        value={editableTask[name]}
                        onChange={handleChange}
                    />
                );
            }
        }
        return <span>{value}</span>;
    }

    const formatDateTime = (dateTime) => {
        const formattedDate = new Date(dateTime).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = new Date(dateTime).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        return `${formattedDate} ${formattedTime}`;
    };

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    if (!task) {
        return null;
    }

    const reloadPage = () => {
        window.location.reload();
    };

    const handleCancelEdit = () => {
        setEditableTask(null);
        setModalClass('task-modal');
    };

    const handleEdit = () => {
        setEditableTask({ ...task });
        setModalClass('task-modal large');
    };

    return (
        <div>
            {isOverlayVisible && <div className="overlay" onClick={closeModal} />}
            <div className={modalClass}>
                <div className="modal-content">
                    <X size={30} onClick={onClose} className='close-task-window'/>
                    <div className="inputs">
                        <label>Название:</label>
                        <h2>{renderField('Name', task.name, 'name')}</h2>
                    </div>
                    <div className="form-container">
                    <div className="left">
                        <div className="inputs">
                            <label>Дедлайн:</label>
                            <p>{renderField('Deadline', formatDateTime(task.deadline), 'deadline')}</p>
                        </div>
                        <div className="inputs">
                            <label>Приоритет:</label>
                            <p>{renderField('Priority', task.priority, 'priority')}</p>
                        </div>
                        <div className="inputs">
                            <label>Категория:</label>
                            <p>{renderField('Category', task.category, 'category')}</p>
                        </div>
                    </div>
                    <div className="right">
                        <div className="inputs">
                            <label>Исполнитель:</label>
                            <p>{renderField('Executor', getEmployeeName(task.executor), 'executor')}</p>
                        </div>
                        <div className="inputs">
                            <label>Статус:</label>
                            <p>{renderField('Status', task.status, 'status')}</p>
                        </div>
                        <div className="inputs">
                            <label>Описание:</label>
                            <p>{renderField('Description', task.description, 'description')}</p>
                        </div>
                    </div>
                    </div>
                        <div className="inputs">
                            <label>Создатель:</label>
                            <p>{getEmployeeName(task.creator)}</p>
                        </div>
                        <div className="inputs">
                            <label>Дата создания:</label>
                            <p>{formatDate(task.created_at)}</p>
                        </div>
                        {showEditButton && editableTask ? (
                        <>
                            <button onClick={handleSave} className='btnSubmit'>Сохранить</button>
                            <button onClick={handleCancelEdit} className='btnSubmit' style={{ marginLeft: '30px' }}>Отменить</button>
                        </>
                    ) : (
                        showEditButton && <button onClick={handleEdit} className='btnSubmit'>Редактировать</button>
                    )}
                </div>
            </div>
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
};

export default TaskModal;