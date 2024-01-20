import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './Home.css'
import Photo1 from './assests/4040107.jpg'
import Photo2 from './assests/695.jpg'
import Rating from '@mui/material/Rating';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Home() {

    const [width, setWidth] = useState(window.innerWidth);

    const [electronics, setElectronics] = useState([])


    const [accessToken, setAccessCookie] = useCookies(['access_token'])

    // console.log(accessToken.access_token)

    function handledWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handledWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handledWindowSizeChange);
        }
    }, [])

    const isMobile = width <= 800;

    useEffect(() => {
        const GetData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/scrap/product_info/electronics/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = res.data
                const parseData = JSON.parse(data.all_products)
                console.log(parseData.amazon)
                setElectronics(parseData.amazon)
            } catch (error) {
                console.error('Error :', error)
            }
        }
        GetData()
    }, [])

    return (
        <>
            <Navbar />
            <div className='Navbar_2'>
                <ul>
                    <li>
                        <a>
                            Mobiles
                        </a>
                    </li>
                    <li>
                        <a>
                            Laptop
                        </a>
                    </li>
                    <li>
                        <a>
                            Shoes
                        </a>
                    </li>
                    <li>
                        <a>
                            Home
                        </a>
                    </li>
                    <li>
                        <a>
                            Books
                        </a>
                    </li>
                    <li>
                        <a>
                            Furniture
                        </a>
                    </li>
                    <li>
                        <a>
                            Watches
                        </a>
                    </li>
                </ul>
            </div>
            <div className='Home_Container'>
                {
                    isMobile ?
                        <div className='Home_Main_Container'>
                            <div className='Home_Main_Text_2'>
                                <p>Compare, Decide, Thrive – Elevate Your Shopping Experience Now!</p>
                            </div>
                            <img src={Photo1} alt='Photo' className='Home_Bg_Image2' />
                        </div>
                        :
                        <div className='Home_Main_Container'>
                            <img src={Photo1} alt='Photo' className='Home_Bg_Image1' />
                            <div className='Home_Main_Text'>
                                <p>Compare, Decide, Thrive – Elevate Your Shopping Experience Now!</p>
                            </div>
                        </div>
                }
            </div>
            <div className='Home_Items'>
                <div className='Home_Items_Head'>
                    <p>Electronics</p>
                </div>
                <div className='Home_Items_Container'>


                    {
                        electronics.map((data, index) => (
                            <div className='Home_Items_Product_Container' key={index}>
                                <div className='Home_Items_Product_Container_Img'>
                                    <img src={data.image} alt='Photo1' className='' />
                                </div>
                                <div className='Home_Items_Product_Container_Price'>
                                    <p>{data.price}</p>
                                </div>
                                <div className='Home_Items_Product_Container_Details'>
                                    <p>{data.title} </p>
                                </div>
                                <div className='flex row h-[20px]'>
                                    <div className='w-50%'>
                                        <Rating
                                            name='Product Rating'
                                            value={data.rating}
                                            readOnly
                                            precision={0.1}
                                            style={{
                                                width: '100%',
                                                fontSize: '17px'
                                            }}
                                        />
                                    </div>
                                    <div className='Home_Items_Product_Container_Rating_Num'>
                                        <p>10,000</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    )
}

export default Home