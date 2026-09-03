import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import API_URL from '../config/api'
import { Helmet } from "react-helmet-async";
const ShowSingleStory = () => {
    
    const [storyDetails, setStoryDetails] = useState({})
    const [name, setName] = useState({})
    const {id} = useParams()
    const token = localStorage.getItem('token')
    useEffect(()=>{
        const getStory = async ()=>{
            const response = await fetch( `${API_URL}/story/${id}`,
                {
                    method:"GET",
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                 const story = await response.json();

                 if(response.ok){
                    setStoryDetails(story.story)
                    setName(story.writerName)
                 }else{
                    setStoryDetails(story.message)
                 }
        }
   

        getStory()
    },[id])
  return (
    <div className='w-full h-auto p-3 sm:p-6 md:p-10 my-10 sm:my-20 '>
        <Helmet>
    <title> Kolom | {storyDetails?.tittle}</title>
</Helmet>
        <div className='grid grid-cols-1 w-[95%] sm:w-[85%] md:w-[70%] rounded-t-2xl rounded-b-3xl h-auto mx-auto bg-green-200'>
<div className='w-full h-48 sm:h-64 md:h-100 rounded-t-2xl'>
<img  src={storyDetails?.storyIMG || ""} alt="Story Photo" className='w-full h-full rounded-t-2xl object-cover' />
</div>
<div className='w-full h-auto p-4 sm:p-8 md:p-15 '>
<h1 className='text-center bangla_font text-xl sm:text-4xl md:text-7xl break-words'>{storyDetails?.tittle} </h1>
<p className='text-right text-md sm:text-xl md:text-3xl font-[poppins]'>{name?.name}</p>
<p className='text-justify bangla_font_story_showing font-bold'>{storyDetails?.story}</p>
</div>
</div>
</div>
  )
}

export default ShowSingleStory
