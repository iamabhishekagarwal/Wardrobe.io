import React from 'react'
import Homepage from './pages/Homepage'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Wardrobe from './pages/Wardrobe'
import Compare from './pages/Compare'

function App() {
   return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage></Homepage>}></Route>
      <Route path='/wardrobe' element={<Wardrobe></Wardrobe>}></Route>
      <Route path='/compare' element={<Compare></Compare>}></Route>
      
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
