import React, { useEffect, useState } from 'react'
import { NavLink} from 'react-router-dom'
import API_URL from '../config/api'

const StoryShowBox = () => {


  const [storyData, setStoryData] = useState([])
    useEffect(() => {
    
    const getProfilePost = async()=>{
        
    const response = await fetch(`${API_URL}/show-story`,
      {
    method:"GET",
      }
    );
    const responseFromServer = await response.json()
    // console.log(response)
    // console.log(responseFromServer)
    if(response.ok){
      setStoryData(responseFromServer.stories)
    }else{
       setStoryData(responseFromServer.message)
    }
    
    }
    getProfilePost()
    }, [])
  return (
    <section className='mt-15 w-[98%] mx-auto border-3 p-5 rounded-3xl bg-[#989898] h-50 relative overflow-hidden'>
      <div className='absolute right-3 top-3 z-10 text-blue-600'>
        <NavLink to='/story'>সমস্ত দেখুন</NavLink>
      </div>

      <div className='flex h-full gap-4 overflow-x-auto pt-7 pb-1'>
        {
          storyData.map((data) => (
            <div
              key={data._id}
              className='min-w-50 min-h-full shrink-0 border-5 border-[#E17100] rounded overflow-hidden'
            >
              <img
                src={data.storyIMG || ''}
                 className='w-full h-[80%] rounded object-cover'
                alt={data.tittle || 'Story'}
              />
              <a
                href={`/story/${data._id}`}
                className='text-blue-400 block text-center text-xl wrap-break-word bg-[#2A3E48]'
              >
                {data.tittle}
              </a>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default StoryShowBox
