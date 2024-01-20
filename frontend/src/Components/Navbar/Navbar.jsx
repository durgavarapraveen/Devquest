import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import axios from 'axios'

function Navbar() {

    const [search, setSearch] = useState('')

    const SearchItem = async (e) => {
        e.preventDefault()
        console.log('Data got')
        console.log(search)
        try {
            const res = await axios.get(`http://127.0.0.1:8000/scrap/product_info/iphone13/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = res.data
            console.log(data)
        } catch (error) {
            console.error('Error :', error)
        }
    }

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        console.log('E')
        console.log(search)
    };

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.key === 'Enter') {
    //             SearchItem(e);
    //         }
    //     };

    //     document.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Clicked')
        console.log('Data got')
        console.log(search)
        try {
            const res = await axios.get(`http://127.0.0.1:8000/scrap/product_info/${search}/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = res.data
            const parseData = JSON.parse(data.all_products)
            console.log(parseData)
        } catch (error) {
            console.error('Error :', error)
        }
    }

    return (
        <div className='Navbar_Container'>
            <div className='Navbar_Main_Container'>
                <div className='Navbar_Logo'>
                    <a href='/'>Compare</a>
                </div>
                <div className='Navbar_Search'>
                    <input type='text' placeholder='search for products...' value={search} onChange={handleInputChange} />
                    <CiSearch onClick={handleSubmit} className='Navbar_search_Icon' />
                </div>

                <div className='flex row absolute right-0 h-100% items-center'>
                    <div className='Navbar_Wishlist'>
                        <CiHeart className='Navbar_Icon' />
                        <p>Wishlist</p>
                    </div>
                    <div className='Navbar_Profile'>
                        <MdAccountCircle className='Navbar_Icon' />
                        <p>Profile</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar