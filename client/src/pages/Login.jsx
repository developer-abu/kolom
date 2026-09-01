import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

const Login = () => {
const navigation = useNavigate()
// use effect for the capture 
const [capture, setCapture] = useState('');
const [captureID, setCaptureID] = useState('');
const [reloadCapture, setReloadCapture] = useState(0);
const handlecaptureReset=()=>{
  setReloadCapture((prev)=>{
    return prev+1
  })
}
useEffect(()=>{
  const getCapture= async ()=>{
try {
  const response = await fetch(`${API_URL}/capture`,
  {
    method:"GET"
  }
)

const data = await response.json();

if(response.ok){
  setCapture(data.capture)
  setCaptureID(data.captureID)
}else{
  setCapture(data.message)
}

} catch (error) {
  setCapture(error.message);
  
}



  }

  getCapture()
},[reloadCapture])
// data post 

const [serverResponse, setServerResponse] = useState("")

const handleUserRegistrationSubmit= async(e)=>{
e.preventDefault()
const loginCredential = e.currentTarget;
const email = e.currentTarget.email.value;
const password = e.currentTarget.password.value;
const capture = e.currentTarget.capture.value;

try {
  
const response = await fetch(
  `${API_URL}/login`,
  {
    method:"POST",
   headers: {
     "Content-Type": "application/json"
    },
    body:JSON.stringify({
        email,
        password,
        capture,
        captureID
      })
    
  }
)


const responseFromServer = await response.json();


if(response.ok){
  setServerResponse(responseFromServer.message)
localStorage.setItem('token', responseFromServer.token)
   loginCredential.reset();
setTimeout(() => {
  navigation('/self-profile')
}, 300);
}else{
    setServerResponse(responseFromServer.message)
}

} catch (error) {

  setServerResponse(error.message)
}




}


  return (
   
      <div className='w-full min-h-screen flex justify-around items-start text-black font-[poppins] mx-auto py-8 sm:py-12'>
    <div className='h-auto w-[95%] sm:w-[80%] md:w-[65%] lg:w-[50%] bg-white border-2 rounded-2xl p-1 sm:p-4 md:p-6'>
   
   <h1 className='capitalize font-[poppins] text-xl sm:text-2xl md:text-3xl text-black bg-blue-500 text-center rounded-2xl'>logIn Page</h1>
       <form action="" onSubmit={handleUserRegistrationSubmit}>
{/* user name field  */}
      <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
        <label htmlFor="" className=' text-lg sm:text-2xl md:text-3xl'>Email ID</label>
      <input type="email" name='email' required className='border w-full sm:w-[80%] md:w-[65%] ml-1 rounded text-sm sm:text-lg md:text-xl' pattern='^[A-Za-z0-9\.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$'/>
        <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Follow Proper Email Pattern</p>
      </div>
 {/* password  field  */}
    <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
        <label htmlFor="" className=' text-lg sm:text-2xl md:text-3xl'>Password</label>
      <input type="password"  onCut={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()}  onCopy={(e) => e.preventDefault()}required name='password' className='border w-full sm:w-[80%] md:w-[65%] ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$'/>
        <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Password must be at least 8 character <br/> Maximum 16 Character <br/> at lest one lowercase character needs <br/> at least one uppercase needs <br/> at least one special character </p>
      </div>
 {/* capture showing  */}
 <div className='flex justify-around m-1 sm:m-4 md:m-5 rounded-2xl p-1 overflow-x-auto'>
 <div >
<input  onCut={(e) => e.preventDefault()}  onCopy={(e) => e.preventDefault()} type='text' name="" id="" readOnly className='resize-none w-32 max-w-full text-center bg-blue-300 rounded-2xl text-black focus:border-0 focus:outline-0 text-2xl' value={capture}></input>
<button type='reset' className='bg-green-300 font-bold py-2 px-4 rounded' onClick={handlecaptureReset}>↺</button>

 </div>

</div>
{/* capture inputting field */}
   <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
        <label htmlFor="" className=' text-lg sm:text-2xl md:text-3xl'>Enter Capture Code Here</label>
       <input type="text"  onCut={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()}  onCopy={(e) => e.preventDefault()} maxLength="6" minLength="6" required name='capture' className='border w-40 ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern='[A-Za-z0-9]{6}'/>
      </div>
   <button type='submit' className='px-2 sm:px-4 py-1.5 sm:py-3 bg-blue-600 rounded text-white text-lg sm:text-3xl block mx-auto'>Login</button>
 
      </form>
           {
      serverResponse && <div className='h-50 w-full mt-2 text-green-500 rounded-3xl'>
  <p className='text-2xl text-center'>{serverResponse}</p>
</div>
     }
        <NavLink to='/register' className='text-blue-700 text-center bangla_font mx-auto block'>Account নেই ? Register করুন</NavLink>
  </div>
 
     </div>
   )
}

export default Login
