import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Testpage() {
    const [file, setFile] = useState(null)
    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }
    const handleClick = () => {
        const fetchData = async () => {

            // Check sessionStorage for email

            // Make an API call to fetch profile data
            try {
                // const response = await axios.post(
                //     'https://1t90hx0fl8.execute-api.us-east-1.amazonaws.com/prod/example',
                //     { email: 'dummy@mail.com' } // Use savedData directly instead of email state here
                // );
                const fileName = encodeURIComponent(file.name);
                const contentType = file.type;
                const response = await axios.post(
                    'https://yij35xtzj5.execute-api.us-east-1.amazonaws.com/prod/presignedurl',
                    { fileName, contentType }
                );
                const { uploadURL } = response.data;
                // Upload the file to S3 using the pre-signed URL
                await axios.put(uploadURL, file, {
                  headers: { 'Content-Type': file.type },
                });
                console.log(response)
            } catch (error) {
                console.error('Error fetching profile:', error);
            }

        };
        fetchData()

    }
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleClick}>Click</button>
        </div>
    )
} export default Testpage;