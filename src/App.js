import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate ,useLocation} from 'react-router-dom';
import { useState,useEffect } from 'react';



function App() {
  const [sessionData, setSessionData] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const handleSignupOnclick = ()=>{
    navigate('/signup')
  }
  const handleLoginOnclick =()=>{
    navigate('/login')
  }
  useEffect(()=>{
    const saveData = sessionStorage.getItem('email')
    if(saveData){
      setSessionData(saveData)
      navigate('/profile', { replace: true, state: { from: location } });
    }
  })

  return (
    <div>
      
      <button onClick={handleSignupOnclick}>Sign Up</button>
      <button onClick={handleLoginOnclick}>Log in</button>
    </div>
  );
}

export default App;
