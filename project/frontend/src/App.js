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
import ProjectCreate from './pages/project-create';
import SideBar from './components/sideBar';
import UserTasks from './pages/user-tasks';


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
          <Route path='/project-create' element={<ProjectCreate />} />
          <Route path='/user-tasks' element={<UserTasks />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
