import React from 'react'
import Homepage from './pages/Homepage'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Wardrobe from './pages/Wardrobe'
import CommunityExchange from './pages/CommunityExchange'
import Trade from './pages/Trade'
import Compare from './pages/Compare'
import OutFits from './pages/OutFits'


function App() {
   return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage></Homepage>}></Route>
      <Route path='/wardrobe' element={<OutFits></OutFits>}></Route>
      <Route path='/compare' element={<Compare></Compare>}></Route>
      <Route path='/Community' element={<CommunityExchange></CommunityExchange>}></Route>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
