import React from 'react'
import hero from "../img/hero.png";
import { NavLink } from 'react-router-dom';

const Hero = () => {



  return (
    <div className='w-[90%] min-h-[420px] sm:min-h-[520px] md:min-h-[640px] mx-auto mt-2 rounded-2xl flex justify-around items-center z-0'>
 <div className='min-h-[420px] sm:min-h-[520px] md:min-h-[640px] w-full rounded-2xl relative overflow-hidden'>
    <img src={hero} alt="hero background photo" className='absolute inset-0 w-full h-full rounded-2xl object-cover'/>
    <div className="relative min-h-[420px] sm:min-h-[520px] md:min-h-[640px] bg-black/40 rounded-2xl flex flex-col items-center px-4 py-10 sm:px-8 sm:py-16 md:py-24">
   
   <h1 className='bangla_font text-3xl sm:text-5xl md:text-7xl text-white text-center text-shadow-md text-shadow-blue-500 pr-2'>বাংলার লেখকদের জন্য
এক আধুনিক সাহিত্য প্ল্যাটফর্ম।</h1>
   
   <p className='bangla_font_subHeading text-lg sm:text-3xl md:text-5xl text-[#f39c12] text-shadow-2xs text-shadow-black text-center mt-6 sm:mt-12 max-w-5xl'>
    প্রতিটি লেখারই একটি ঠিকানা প্রয়োজন। এমন একটি জায়গা, যেখানে শব্দ শুধু পড়া হয় না—অনুভবও করা হয়।
   </p>

{/* to show to button to write post and reding post */}
   <div className='w-full mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8'>
<div>
      <NavLink to='/login'className='bg-[#166534] bangla_font rounded-sm px-8 py-2 leading-none text-2xl text-white'>
লিখুন
    </NavLink>
</div>

<div>
      <NavLink to='/story' className='bg-[#166534] bangla_font rounded-sm  text-2xl px-8 py-2 leading-none text-white'>
পড়ুন
    </NavLink>
</div>
   </div>



   </div>
 </div>
    </div>
  )
}

export default Hero
