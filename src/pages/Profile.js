import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


function Profile() {
    const [sessionData, setSessionData] = useState('')
    const [email, setEmail] = useState('')
    const [img, setImg] = useState('')
    const [name, setName] = useState('')
    const [file,setFile] = useState(null)
    const [upload, setUpload] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {

            // Check sessionStorage for email
            const savedData = sessionStorage.getItem('email');
            if (savedData) {
                setSessionData(savedData);
                setEmail(savedData);

                // Make an API call to fetch profile data
                try {
                    const response = await axios.post(
                        'https://b4c2wtgrse.execute-api.us-east-1.amazonaws.com/prod/profile',
                        { email: savedData } // Use savedData directly instead of email state here
                    );
                    const data = response.data.data[0]
                    setName(data.name)
                    setImg(data.img)
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            } else {
                // Navigate to login page if no email is found in sessionStorage
                navigate('/', { replace: true, state: { from: location } });
            }
        };

        // Call the async function
        fetchData();
    }, [email,upload,]); 
    
    const handleLogOut= (e)=>{
        sessionStorage.removeItem('email')
        setEmail('')
        setImg('')
        setName('')
    }
    const handleUpload = async()=>{
        if(!file){
            return
        }
        try {
            const fileName = encodeURIComponent(file.name);
            const contentType = file.type;
            const response = await axios.post(
                'https://b4c2wtgrse.execute-api.us-east-1.amazonaws.com/prod/presignedurl',
                {fileName,contentType}
            );
            const { uploadURL } = response.data;
            // Upload the file to S3 using the pre-signed URL
            await axios.put(uploadURL, file, {
              headers: { 'Content-Type': file.type },
            });
            console.log(response)
            const updateDatabase = await axios.post(
                'https://b4c2wtgrse.execute-api.us-east-1.amazonaws.com/prod/update',{fileName,email}
            )
            if(updateDatabase.status === 200){
                setFile(null)
                if(upload){
                    setUpload(false)
                }else{
                    setUpload(true)
                }
            }

        }catch(error){
            console.log("Error uploading :",error)
        }
    }
    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }
    return (
        <div>
            <div>
                Welcome From AWS
            </div>
            <div>
                Name : {name}
            </div>
            <div>
                Email : {email}
            </div>
            <div>
            <img src={img} alt={name} style={{width:'100px'}}/>
            </div>
            <br/>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Photo</button>
            <br/>
            <br/>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    )
}
export default Profile