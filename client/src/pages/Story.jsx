import React, { useEffect, useState } from 'react'

const Story = () => {

   const [storyData, setStoryData] = useState([])
      useEffect(() => {
      
      const getProfilePost = async()=>{
       
      const response = await fetch('http://localhost:3000/show-story',
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
    <div  className='w-full max-w-7xl h-auto my-10 sm:my-20 mx-auto bg-green-200 p-4 sm:p-6 md:p-10 grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>

{
  storyData.map((data)=>{
  
return <div  className='w-full min-w-0 max-w-64 h-auto min-h-64 border-5 border-[#E17100] rounded overflow-hidden mx-auto'>
<img src={data.storyIMG?`http://localhost:3000/uploads/writingIMG/${data.storyIMG}`:""} className='w-full h-52 rounded object-cover'/>
<a href={`/story/${data._id}`} className='text-blue-400 block text-center min-h-10 h-auto p-1 text-lg wrap-break-word bg-[#2A3E48]'>{data.tittle}</a>
</div>
  })
}


    </div>
  )
}

export default Story
