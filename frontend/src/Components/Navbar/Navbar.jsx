import React from 'react'
import './Navbar.css'
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  return (
    <div className='Navbar_Container'>
        <div className='Navbar_Main_Container'>
            <div className='Navbar_Logo'>
                <a href='/'>Compare</a>
            </div>
            <div className='Navbar_Search'>
                <input type='text' placeholder='search for products...' />
                <CiSearch className='Navbar_search_Icon'/>
            </div>

            <div className='flex row absolute right-0 h-100% items-center'>
                <div className='Navbar_Wishlist'>
                    <CiHeart className='Navbar_Icon'/>
                   <p>Wishlist</p>
                </div>
                <div className='Navbar_Profile'>
                    <MdAccountCircle className='Navbar_Icon'/>
                    <p>Profile</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar