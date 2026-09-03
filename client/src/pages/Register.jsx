import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import API_URL from '../config/api'
import { Helmet } from "react-helmet-async";
const Register = () => {
const navigate = useNavigate()
// for otp 
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [email, setEmail] = useState("");
// FOR CAPTURE
const [capture, setCapture] = useState('');
const [captureID, setCaptureID] = useState('');
const [reloadCapture, setreloadCapture] = useState(0);
const handlecaptureReset=()=>{
  setreloadCapture((prev)=>{
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


const [serverResponse, setServerResponse] = useState("")

const handleUserRegistrationSubmit= async(e)=>{
    alert('IT CAN TAKE A LITTLE BIT OF TIME TO SEND OTP. WAIT A BIT BEFORE RELOAD OR DOUBLE CLICK')
e.preventDefault()
const registerCredentials = e.currentTarget
const formData = new FormData(registerCredentials)
formData.append("captureID", captureID);
try {
  
const response = await fetch(
  `${API_URL}/register`,
  {
    method:"POST",
    body:formData
  }
);



const responseFromServer = await response.json();


if(response.ok){

  setServerResponse(responseFromServer.message)

  setOtpSent(true);
  //  registerCredentials.reset();


}else{
    setServerResponse(responseFromServer.message)
}

} catch (error) {

  setServerResponse(error.message)
}




}
// verify otp 
const handleOTPVerification = async () => {

    try {

        const response = await fetch(`${API_URL}/verify-otp`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                otp: otp
            })
        });

        const responseData = await response.json();

       if(response.ok){
        setServerResponse(responseData.message)
        setTimeout(() => {
  navigate('/login')
}, 3000);
       }else{
            setServerResponse(responseData.message)
       }

    } catch (error) {

           setServerResponse(error.message)

    }
};

  return (
     <div className='w-full min-h-screen flex justify-around items-start text-black font-[poppins] py-8 sm:py-12'>
      <Helmet>
    <title>Kolom | Register</title>
</Helmet>
   <div className='h-auto w-[95%] sm:w-[80%] md:w-[65%] lg:w-[50%] bg-white border-2 rounded-2xl p-1 sm:p-4 md:p-6 mx-auto'>
  
  <h1 className='capitalize font-[poppins] text-xl sm:text-2xl md:text-3xl text-black bg-blue-500 text-center rounded-2xl'>Registration Page</h1>
      <form action="" method='' encType="multipart/form-data" onSubmit={handleUserRegistrationSubmit}>


     <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
       <label htmlFor="name" className=' text-lg sm:text-2xl md:text-3xl'>Enter Your Name</label>
      <input type="text" name='name' minLength="3" maxLength="25" required placeholder='Enter Name Here' className='border w-full sm:w-[80%] md:w-[65%] sm:ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern='^[A-Za-z\s]+$' />
      <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Only Capital or Small letter  and space are allowed 3 - 25 character</p>
     </div>
<div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
    <label htmlFor="userImg"  className='text-lg sm:text-2xl md:text-3xl'>Upload Your Img</label>
    <input type="file" name='userImg' required className='border w-full max-w-full sm:w-[50%] text-sm rounded sm:ml-1' accept=".jpg,.jpeg,.png"/>
     <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Only JPG JPEG PNG are allowed. Maximum Size 2 MB</p>
</div>
   <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
       <label htmlFor="bio" className=' text-lg sm:text-2xl md:text-3xl'>Enter Bio</label>
      <input type="text" name='bio' placeholder='Enter Bio here' minLength="15" maxLength="25" required className='border w-full sm:w-[80%] md:w-[65%] sm:ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern="[\u0980-\u09FF\s]+" />
           <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Only Bangla letter will be accepted <br/> Minimum Length 15 and Maximum Length 25 </p>
     </div>
     <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
       <label htmlFor="email"  className=' text-lg sm:text-2xl md:text-3xl'>Email ID</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"name='email' required className='border w-full sm:w-[80%] md:w-[65%] sm:ml-1 rounded text-sm sm:text-lg md:text-xl'  pattern='^[A-Za-z0-9\.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$'/>
       <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Follow Proper Email Pattern</p>
     </div>

   

   <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
       <label htmlFor="password"   onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onCut={(e) => e.preventDefault()} className=' text-lg sm:text-2xl md:text-3xl'>Password</label>
      <input type="password" required name='password' minLength="8" maxLength="16" className='border w-full sm:w-[80%] md:w-[65%] sm:ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$'/>
       <p className='text-sm sm:text-md text-black bg-gray-400 px-1 sm:px-2 mt-1 sm:mt-2 rounded-2xl inline-block'>Password must be at least 8 character <br/> Maximum 16 Character <br/> at lest one lowercase character needs <br/> at least one uppercase needs <br/> at least one special character </p>
     </div>

 {/* capture showing  */}
<div className='flex justify-around m-1 sm:m-4 md:m-5  rounded-2xl p-1'>

 <div>
<input  onCut={(e) => e.preventDefault()}  onCopy={(e) => e.preventDefault()} type='text' name="" id="" readOnly className='resize-none w-32 max-w-full text-center bg-blue-300 rounded-2xl text-black focus:border-0 focus:outline-0 text-2xl' value={capture}></input>
<button type='reset' className='bg-green-300 font-bold py-2 px-4 rounded' onClick={handlecaptureReset}>↺</button>
 </div>

</div>
{/* capture inputting field */}
   <div className='m-1 sm:m-4 md:m-5 border rounded-2xl p-1 sm:p-5 md:p-5'>
        <label htmlFor="" className=' text-lg sm:text-2xl md:text-3xl'>Enter Capture Code Here</label>
       <input onPaste={(e) => e.preventDefault()} type="text" maxLength="6" minLength="6" required name='capture' className='border w-40 ml-1 rounded text-sm sm:text-xl md:text-2xl' pattern='[A-Za-z0-9]{6}'/>
      </div>
{otpSent && (<div className='w-[95%] sm:w-[90%] mx-auto my-4'>
<label htmlFor="otp" className='bangla_font text-lg sm:text-xl block mb-2'>আপনার Email এ পাঠানো OTP দিন</label>
<input id="otp"name="otp"type="text"maxLength="6"value={otp}onChange={(e) => setOtp(e.target.value)}placeholder="৬ সংখ্যার OTP লিখুন"className='w-full border rounded h-10 px-3 text-center text-lg focus:outline-none'/>

<button type="button" className='block mx-auto mt-3 px-5 py-2 bg-blue-500 text-white font-[Poppins] text-lg cursor-pointer rounded hover:bg-black' onClick={handleOTPVerification}> Verify OTP</button>

</div>
)}

  <button type='submit' className='px-2 sm:px-4 py-1.5 sm:py-3 bg-blue-600 rounded text-white text-lg sm:text-3xl block mx-auto cursor-pointer'>Register</button>

     </form>

     {
      serverResponse && <div className='h-50 w-full mt-2 text-green-500 rounded-3xl'>
  <p className='text-2xl text-center'>{serverResponse}</p>
</div>
     }
       <NavLink to='/login' className='text-blue-700 text-center bangla_font mx-auto block'>Account আছে ? Login করুন</NavLink>
       

 </div>


  
    </div>
    
  )
}

export default Register
