import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminSummary from './components/AdminSummary';
import Courses from './components/Courses';
import Students from './components/Students';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register'element={<Register />}/>
        <Route path='/forgot-password'element={<ForgotPassword />}/>
     

        <Route path="/admin-summary"
          element={
                <AdminSummary />
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="courses" element={<Courses />} />
          <Route path="students" element={<Students />} />

          
        </Route>
      </Routes>
    </Router>
  
  );
}

export default App;
