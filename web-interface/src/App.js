import './App.css';
import Admin from './Pages/Admin';
import Client from './Pages/Client';
import Test from './Pages/Test';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div style={{height: "100vh", width: "100vw"}}>
      <Routes>
        <Route index element={<Admin/>} />
        <Route path='client' element={<Client/>} />
        <Route path='test' element={<Test/>} />
      </Routes>
    </div>
  );
}

export default App;