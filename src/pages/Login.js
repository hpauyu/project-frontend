import { useState, useEffect } from "react";
import { useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';

function Login(){
    const [sessionData,setSessionData] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const location =  useLocation()

    useEffect(()=>{
        const saveData = sessionStorage.getItem('email')
        if(saveData){
            setSessionData(saveData)
            navigate('/profile', { replace: true, state: { from: location } });
        }
    })

    const handleLogin = async() =>{
        const response = await axios.post(
            'https://v2ljht5u1c.execute-api.us-east-1.amazonaws.com/prod/login',
            {
                email,password
            }
        )
        if(response.status ===200){
            sessionStorage.setItem('email',email)
            setSessionData(sessionStorage.getItem('email'))
        }
    }

    return(
        <div>
           <div>
            Log In Here
           </div>
           <br/>
           <label>
            Email
            <input type="email" onChange={e => setEmail(e.target.value)} required/>
           </label>
           <br/>
           <label>
            Password
            <input type="password" onChange={e => setPassword(e.target.value)} required/>
           </label>
           <br/>
           <button onClick={handleLogin}>Log In</button>
        </div>
    )
}
export default Login;