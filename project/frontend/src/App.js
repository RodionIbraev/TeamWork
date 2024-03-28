import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { Main } from './pages/main/main';


function App() {
  return (
    <div className="App">
      <Router>
        <Main>
          <Routes>
            <Route path='/' />
            <Route path='/' />
          </Routes>
        </Main>
      </Router>
    </div>
  );
}

export default App;
