import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import '../styles/projects.css'
import { Trash } from 'phosphor-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const responseProjects = await axios.get('http://127.0.0.1:8000/projects/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setProjects(responseProjects.data);
            } catch (error) {
                console.error('Error fetching projects data:', error);
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

        const fetchUserProfile = async () => {
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
      };

        fetchProjects();
        fetchEmployees();
        fetchUserProfile();
    }, []);

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

    const openModal = (project) => {
      setSelectedProject(project);
      setShowModal(true);
      setShowOverlay(true);
  };
  
  const closeModal = () => {
      setShowModal(false);
      setShowOverlay(false);
  };
  
  const handleDeleteProject = async () => {
      try {
          await axios.delete(`http://127.0.0.1:8000/project/delete/${selectedProject.id}/`, {
              headers: {
                  'token': sessionStorage.getItem("accessToken"),
              }
          });
          
          setProjects(projects.filter(project => project.id !== selectedProject.id));
  
          toast.success("Вы удалили проект!");
          console.log(`Проект "${selectedProject.name}" успешно удален!`);

          closeModal();
      } catch (error) {
          console.error('Error deleting project:', error);
      }
  };

    return (
        <div className='projects'>
            <Helmet>
                <title>Просмотр проектов</title>
            </Helmet>
            {showOverlay && <div className="overlay" onClick={closeModal}></div>}
            {projects.map(project => (
              <div key={project.id} className='project-card'>
                <Link key={project.id} to={`/project/${project.id}`} className='project-link'>
                  <div className="card-top">
                    <p>Создатель: {getEmployeeName(project.creator)}</p>
                    <p><strong>{project.name}</strong></p>
                    <p>Создан: {formatDate(project.created_at)}</p>
                  </div>
                  </Link>
                  <div className="description">
                    <p>{project.description}</p>
                  </div>
                  {userProfile && userProfile.id === project.creator && (
                    <Trash size={32} onClick={() => openModal(project)} className='project-delete'> </Trash>
                  )}
                  
              </div>
            ))}
        {showModal && selectedProject && (
            <div className="modal">
                <div className="modal-content">
                    <p>Вы действительно хотите удалить проект "{selectedProject.name}"?</p>
                    <div className="modal-btns">
                      <button onClick={handleDeleteProject}>Да</button>
                      <button onClick={closeModal}>Нет</button>
                    </div>
                </div>
            </div>
        )}
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

export default Projects;
