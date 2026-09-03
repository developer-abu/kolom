import React from 'react'
import Hero from '../component/Hero'
import StoryShowBox from '../component/StoryShowBox'
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
    <Helmet>
    <title>Kolom | Home</title>
</Helmet>

    <Hero/>
    <StoryShowBox/>
    
    </>
  )
}

export default Home
