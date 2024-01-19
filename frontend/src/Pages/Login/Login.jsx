import React, { useState } from 'react'
import './Login.css'
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

    const [openSignup, setOpenSignup] = useState(false)
    const [loginData, setLoginData] = useState({
        email: '',
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

    const handleSubmitLogin = (e) => {
        e.preventDefault()
        if (loginData.email === '') {
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
        console.log(loginData)
    }

    const handleSubmitRegister = (e) => {
        e.preventDefault()
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
                                        <TextField id="standard-basic" label="Email" type='email' variant="standard"
                                            sx={{
                                                color: 'white',
                                                margin: '10px 0'
                                            }}
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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