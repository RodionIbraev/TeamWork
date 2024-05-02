import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { Main } from './pages/main';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import Register from './pages/register';
import Login from './pages/login';
import { UserProfile } from './pages/user-profile';
import Projects from './pages/projects';
import ProjectTasks from './pages/projectTasks';
import ProjectsCreate from './pages/project-create';
import SideBar from './components/sideBar';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <SideBar />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user-profile' element={<UserProfile />} />
          <Route path='/projects' element={<Projects />} />
          <Route path="/project/:projectId" element={<ProjectTasks />} />
          <Route path='/project-create' element={<ProjectsCreate />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
