import React from 'react'
import Wardrobecard from '../components/cards/Wardrobecard'
import Navbar from '../components/navbar/Navbar'
import { useAuth0 } from '@auth0/auth0-react'

const Wardrobe = () => {
  return (
    <div>


        <Navbar></Navbar>
        <Wardrobecard></Wardrobecard>


    </div>
    
   
  )
}

export default Wardrobe
