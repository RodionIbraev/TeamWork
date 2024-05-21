import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { X } from 'phosphor-react';
import '../styles/documents.css'

function Documents({ projectId, onClose }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/project/${projectId}/documents/`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                
                const documentsArray = Object.keys(response.data).map(key => ({
                    name: key,
                    url: response.data[key]
                }));
                
                setDocuments(documentsArray);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDocuments();
    }, [projectId]);

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
        {isOverlayVisible && <div className="overlay" onClick={closeModal}/>}
        <div className="task-modal">
        <h2 style={{color: 'var(--white-color)'}}>Документы проекта</h2>
        <X size={30} onClick={onClose} className='close-task-window' style={{right: '20px'}}/>
        {documents.length > 0 && (
            <ul className="documents">
                {documents.map((document) => (
                    <li key={document.id}>
                            <a href={document.url} target="_blank" rel="noopener noreferrer">{document.name}</a>
                    </li>
                ))}
            </ul>
        )}
        </div>
        </div>
    );
}


export default Documents