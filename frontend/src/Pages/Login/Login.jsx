import React, { useState} from 'react'
import './Login.css'
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {

    document.title = 'Login | Compare'

    const navigate = useNavigate()
    

    const [accessToken, setAccessCookie] = useCookies(["access_token"]);
    const [refreshToken, setRefreshCookie] = useCookies(["Refresh_token"]);

    const [openSignup, setOpenSignup] = useState(false)
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleOpenSignup = () => {
        setOpenSignup(true)
    }

    const handleOpenSignIn = () => {
        setOpenSignup(false)
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        if (loginData.username === '') {
            return toast.warn('Please enter Email', {
                position: 'top-center',
                theme: 'colored'
            })
        }
        if (loginData.password === '') {
            return toast.warn('Please enter Password', {
                position: 'top-center',
                theme: 'colored'
            })
        }

        try {
            const res = await axios.post('http://127.0.0.1:8000/users/token/', {'username': loginData['username'], 'password': loginData['password']}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = res.data;
            setAccessCookie('access_token', data.access)
            setRefreshCookie("Refresh_token", data.refresh)
            navigate('/')
            console.log(data)
        }catch(error) {
            console.error(error)
        }
        console.log(loginData)
    }

    const handleSubmitRegister = async (e) => {
        // e.preventDefault()
        if (registerData.username === '') {
            return toast.warn('Please enter Username', {
                position: 'top-center',
                theme: 'colored'
            })
        }
        if (registerData.email === '') {
            return toast.warn('Please enter Email', {
                position: 'top-center',
                theme: 'colored'
            })
        }
        if (registerData.password === '') {
            return toast.warn('Please enter Password', {
                position: 'top-center',
                theme: 'colored'
            })
        }


        try {
            const res = await fetch(`http://localhost:8000/users/create/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(registerData)
            })
            if (res.ok) {
                toast.success("Registered Successfully", {
                    position: "top-center",
                    theme: "colored"
                });
                console.log(res)

                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Registration failed. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error :', error)
        }
        console.log(registerData)
    }


    return (
        <div className='Login_Main_Container'>
            <div className='Login_Container'>
            </div>
            <div className='Login_Box'>
                <div className='Login_Box_Slogon'>
                    <p>Compare</p>
                </div>
                <div className='flex media_700:flex-row flex-col'>
                    <div className='Login_slogan'>
                        <p>CHOOSE WISELY!</p>
                    </div>
                    <div className='Login_Register'>
                        {
                            openSignup ?
                                <div className='Login_Form'>
                                    <form>
                                        <TextField id="standard-basic" label="User Name" type='text' variant="standard" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
                                        <TextField id="standard-basic" label="Email" type='email' variant="standard" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                margin: '10px 0'
                                            }}
                                        />
                                        <TextField id="standard-basic" type='password' label="Password" variant="standard" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
                                        <button className='button-50' onClick={handleSubmitRegister}>Register</button>
                                    </form>
                                    <br></br>
                                    <p>Already have an account? <button onClick={handleOpenSignIn} className='linkbutton_Login'>signin</button></p>
                                </div>
                                :
                                <div className='Login_Form'>
                                    <form>
                                        <TextField id="standard-basic" label="Email" type='text' variant="standard"
                                            sx={{
                                                color: 'white',
                                                margin: '10px 0'
                                            }}
                                            value={loginData.username}
                                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                        />
                                        <TextField id="standard-basic" label="Password" type='password' variant="standard" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                        <button className='button-50' onClick={handleSubmitLogin}>Login</button>
                                    </form>
                                    <br></br>
                                    <p>Don't have an account? <button className='linkbutton_Login' onClick={handleOpenSignup}>signup</button></p>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login