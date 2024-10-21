import { useState,useEffect } from "react";
import axios from 'axios';
import { useNavigate ,useLocation } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [file, setFile] = useState(null)
    const [sessionData, setSessionData] = useState('')
    const navigate = useNavigate();
    const location = useLocation();

    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }
    
    const handleSignup = async()=>{
        if( !file || !email || !password || !name){
            return
        }
        try {
            const fileName = encodeURIComponent(file.name);
            const contentType = file.type;
            const response = await axios.post(
                'https://517x6ucd42.execute-api.us-east-1.amazonaws.com/prod/presignedurl',
                {fileName,contentType}
            );
            const { uploadURL } = response.data;
            // Upload the file to S3 using the pre-signed URL
            await axios.put(uploadURL, file, {
              headers: { 'Content-Type': file.type },
            });
      
      
            const addToDatabase = await axios.post(
                'https://517x6ucd42.execute-api.us-east-1.amazonaws.com/prod/signup',
                {
                    email,password,name,fileName
                }
            )
            if(addToDatabase.status === 200){
                sessionStorage.setItem('email',email)
                setSessionData(sessionStorage.getItem('email'))
                console.log("succeed")
            }

        }catch(error){
            console.log("Error uploading :",error)
        }

    }
    useEffect(() => {
        const savedData = sessionStorage.getItem('email');
        if (savedData) {
            setSessionData(savedData);
        }
    }, []);
    useEffect(() => {
        if (sessionData) {
            navigate('/profile', { replace: true, state: { from: location } });
        }
    }, [sessionData, navigate, location]);

    const handleLogin =()=>{
        navigate('/login',{replace:true, state:{from:location}});
    }

    return (
        <div>
            Sign Up Here
            <br />
            <label>
                Email
                <input type="email" onChange={e => setEmail(e.target.value)} required >
                </input>
            </label>
            <br />
            <label>
                Password
                <input type="password" onChange={e => setPassword(e.target.value)} required></input>
            </label>
            <br />
            <label>
                Name
                <input type="text" onChange={e => setName(e.target.value)} required/>
            </label>
            <br/>
            <label>
                Profile Picture
                <input type="file" onChange={handleFileChange} />
            </label>
            <br/>
            <button onClick={handleSignup}>Sign up</button>
            <button onClick={handleLogin}>Log in</button>
        </div>
    )
}
export default Signup;