import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Story from './pages/Story';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './component/Header';
import Footer from './component/Footer';
import Profile from './pages/Profile';
import ProtectedRoute from './component/protectedRoute/ProtectedRoute.profile';
import ProfileProtected from './component/protectedRoute/ProfileProtected';
import NotFound from './pages/NotFound';
import ShowSingleStory from './pages/ShowSingleStory';

const App = () => {
  return (
    <div>
   
<BrowserRouter>
<Header/>

<Routes>

<Route path='/' element={<Home/>}></Route>
<Route path='/story' element={<ProtectedRoute>  <Story/> </ProtectedRoute>}></Route>
<Route path='/login' element={<ProfileProtected> <Login/> </ProfileProtected>}></Route>
<Route path='/register' element={<ProfileProtected> <Register/> </ProfileProtected>}></Route>
<Route path='/self-profile' element={<ProtectedRoute>  <Profile/> </ProtectedRoute>}></Route>
<Route path='*' element={<NotFound/>}></Route>
<Route path='/story/:id' element={<ProtectedRoute> <ShowSingleStory/> </ProtectedRoute>}></Route>
</Routes>

<Footer/>
</BrowserRouter>

    </div>
  )
}

export default App
