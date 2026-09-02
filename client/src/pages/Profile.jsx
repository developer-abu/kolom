import React from 'react'

import { useEffect,useState } from 'react'

import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'


const Profile = () => {
// for getting user info 
  const [user, setUser] = useState(null);
  // message after submitting story 
  const [message, setMessage] = useState("")
  // getting data of own posts 
  const [storyData, setStoryData] = useState([])

  const navigate = useNavigate()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      return navigate('/login')
    }
const getProfile = async ()=>{
try {
  const response = await fetch(`${API_URL}/self-profile`,{
    method:"GET",
    headers:{
      Authorization:`Bearer ${token}` 
    }
  })

  const data = await response.json()
  if(response.ok){
    setUser(data.user)
  }



} catch (error) {
alert(error.message)
}

}

   getProfile();

  },[])


const logOut=()=>{
  localStorage.removeItem('token')
  navigate('/login')
}

// logic for the story posts
const HandleSubmit = async(e)=>{

const token = localStorage.getItem('token')
  e.preventDefault();
    const myFormDataToPostStory= e.currentTarget
     const formdata= new FormData(myFormDataToPostStory)
try {

const response = await fetch(`${API_URL}/self-profile`,
  {
    method:"POST",
    headers:{
Authorization:`Bearer ${token}`
    },
    body:formdata
  }
)

// console.log("STATUS:", response.status)
// console.log("STATUS:", response)

const data= await response.json()
if(response.ok){
  // console.log("SERVER RESPONSE:", data)
    
setMessage(data.message);
myFormDataToPostStory.reset();
setTimeout(() => {
  setMessage("")
}, 3000);

   
}else{
  setMessage(data.message)
   setTimeout(() => {
   setMessage("")
 }, 3000);
}
} catch (error) {
    setMessage(error.message)
setTimeout(() => {
    setMessage("")
}, 3000);
}
}
// for receiving story list 

useEffect(() => {

const getProfilePost = async()=>{
      const token = localStorage.getItem('token')
const response = await fetch(`${API_URL}/self-profile/posts`,
  {
method:"GET",
headers:{
 Authorization:`Bearer ${token}`
}
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
}, [storyData])

const handleDeleteStory= async(id,tittle)=>{
 try {
   const userConfirmation = confirm(`Are You Confirm To Delete ${tittle}`)
  
  if(userConfirmation){
 const token = localStorage.getItem('token')
  const response= await fetch(`${API_URL}/delete/${id}`,
    {
      method:'DELETE',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )
  const data = await response.json();
  if(response.ok){
    alert(data.message)

    setStoryData((previousStory)=>{
     return previousStory.filter((story)=>{
      return  story._id !== id
      })
    })


  }else{
     alert(data.message)
  }
  }else{
    alert(`You did not delete the story ${tittle}`)
  }
 } catch (error) {
  alert(error.message)
 }
      
}

// delete profile
const deleteProfile = async ()=>{
   const token = localStorage.getItem('token')
const response = confirm('Do You Want Delete Profile ? Your Profile and the content will be deleted.');
if(response){
const response = await fetch(`${API_URL}/delete/profile`,{
    method:'DELETE',
      headers:{
        Authorization:`Bearer ${token}`
      }
})
const data = await response.json()
if(response.ok){
  alert(data.message)
 localStorage.removeItem('token')
  navigate('/login')
}else{
    alert(data.message)
}
}else{
  alert("Thank You. Your profile has not been deleted.")
}
}

// delete profile 

  return (
   <div className='h-auto w-full px-2 sm:px-5'>
            <div className='bg-amber-600 w-full h-20 flex items-center justify-around'>
               <h1 className=' text-sm sm:text-lg md:text-2xl font-bold bangla_font'>{user?.name} আপনাকে কলমে স্বাগতম</h1>
              
            </div>
       <div className='w-full flex flex-col xl:flex-row xl:justify-around my-10 sm:my-20 xl:my-25 gap-6 sm:gap-10'>
{/* profile section */}

             <div className='w-full xl:w-[33%] min-h-100 h-auto rounded-2xl border flex flex-col items-center bg-[#eeaf6f]'>
               <div className='h-28 w-28 sm:h-35 sm:w-35 rounded-full mx-auto mt-2'>
                  <img    src={user?.userImg || ""} alt=""  className='h-full w-full rounded-full'/>
                </div>
                <h1 className='font-[poppins] ml-5 font-black text-sm sm:text-lg md:text-xl mt-2 text-center text-[#1A1A1A] '><span className='bangla_font text-black'>নামঃ</span> {user?.name}</h1>
                <p className='bangla_font ml-5 font-black text-sm sm:text-lg md:text-xl mt-2 text-center text-[#1A1A1A] '> <span className='text-black'>পরিচিতিঃ </span>{user?.bio}</p>
                <p className='font-[poppins] ml-5 font-black text-sm sm:text-lg md:text-xl mt-2 text-center text-[#1A1A1A] '><span className='bangla_font text-black'>ইমেলঃ</span> {user?.email}</p>
                <button onClick={logOut}className='bg-blue-700 px-3 py-2 text-white text-shadow-lg text-shadow-indigo-500 rounded mt-10 font-[poppins] text-3xl cursor-pointer'>Logout</button>
                <button onClick={deleteProfile}className='bg-blue-700 px-3 py-2 text-white text-shadow-lg text-shadow-indigo-500 rounded mt-10 font-[poppins] text-3xl cursor-pointer'>Delete Profile</button>
              </div>

              {/* form for submit story */}
         <div className='bg-white border w-full xl:w-[33%] h-auto rounded-2xl overflow-hidden'>
              <h1 className='bangla_font relative text-center rounded py-2 px-2 sm:px-3 bg-amber-100 mt-2 mb-2 text-2xl sm:text-3xl'>আপনার লেখা প্রকাশ করুন</h1>
<form action="" onSubmit={HandleSubmit}>
  <div >
<input name='tittle' type="text" required className='w-full text-center border h-10 px-2 text-sm sm:text-base' minLength="3" maxLength="20" placeholder='আপনার গল্পের শিরনাম লিখুন' pattern="^[\u0980-\u09FF\s]+$"/>
    <p className='bangla_font bg-green-300 text-black py-1 px-2 rounded text-sm text-center'>গল্পের শিরনাম ৩ থেকে ২০ character এর মধ্যে লিখুন </p>
  </div> 
<div className='w-[95%] sm:w-[90%] mx-auto'>
    <label htmlFor="file" className='bangla_font mt-2'>গল্পের জন্য একটা ছবি আপলোড করুন</label> <br />
    <input name='storyIMG' type="file" className='border w-full max-w-full text-sm' accept=".jpg,.jpeg,.png" required/>
        <p className='bangla_font bg-green-300 text-black py-1 px-2 rounded text-sm text-center'> 2 MB এর মধ্যে jpg png jpeg ছবি আপলোড করুন </p>
</div>
<div className='w-[95%] sm:w-[90%] mx-auto'>
<label htmlFor="story" className='bangla_font text-base sm:text-lg'>আপনার গল্প লিখুন</label>
<textarea name="story" id="story" minLength="1000" maxLength="10000000000" required className='border resize-none w-full h-50 scroll-auto indent-3 px-2 sm:px-3 text-sm sm:text-base' pattern="^[\u0980-\u09FF\s.,!?;:'&quot;“”‘’()\-—–।,?!ঃ]+$"> </textarea>   <p className='bangla_font bg-green-300 text-black py-1 px-2 rounded text-sm text-center'>গল্প 1000 থেকে 10000000000 character এর মধ্যে লিখুন </p>
 </div>
 <button type='submit' className='my-2 mx-auto block bg-blue-500 rounded py-2 px-3 text-white bangla_font cursor-pointer' >পোস্ট করুন</button>
</form>

<p className='text-center text-green-500 bangla_font'>{message}</p>

  </div>

{/* list of published content */}

             <div className='bg-green-100 w-full xl:w-[33%] h-100 rounded-2xl overflow-y-scroll px-2 sm:px-5'>
  <h1 className='bangla_font text-center w-full mt-2 sticky left-0 top-0 bg-amber-400 rounded-2xl p-2'>আপনার প্রকাশিত লেখা সমুহু</h1>



<table className='border-2 w-full sm:w-[95%] mx-auto text-center my-5'>
  <tr className='border p-5'>
  <th className='border'>Story</th>
  <th>Action</th>
</tr>
  {
      storyData.map((data)=>{
return <tr className='border hover:bg-gray-600'>
<td className='border p-2 sm:p-5 wrap-break-word'>
      <a href={`/story/${data._id}`} className='text-blue-500 underline block bangla_font hover:text-amber-600 hover:no-underline'>{data.tittle}</a>
  </td>

<td className='p-1'>
  <button className='px-2 sm:px-3 py-2 bg-blue-500 text-white font-[Poppins] text-sm sm:text-base cursor-pointer rounded hover:bg-black whitespace-nowrap' onClick={()=>{handleDeleteStory(data._id,data.tittle)}}>Delete</button>
</td>

</tr>
  })
  }
</table>


</div>
              </div>
            </div>
  
  )
}

export default Profile
