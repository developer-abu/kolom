import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
const Header = () => {

  const [mobileMenu, setMobileMenu] = useState(false)

  const menuClick = ()=>{
setMobileMenu(!mobileMenu)
  }
  return (
    <header className='h-20 w-full shadow-xl shadow-black/9 flex justify-between items-center bg-amber-600 sticky top-0 left-0 z-50'>

{/* mobile view  */}

<div className='bangla_font text-2xl p-5 pl-2.5 h-18 w-18 bg-cyan-300 rounded-full lg:hidden z-50'>
কলম
</div>
<button className='lg:hidden text-3xl relative left' onClick={menuClick}>
{mobileMenu?"✕":"☰"}
</button>
{
  mobileMenu&&
<div className='w-full py-2 bg-amber-600 absolute left-0 top-20 text-shadow-md text-shadow-black'>

<div className='bg-white w-full mt-1'><NavLink to="/" className='p-2 text-black text-2xl'>হোম</NavLink></div>


<div  className='bg-white w-full mt-1'><NavLink to="/story" className='p-2 text-black text-2xl'>গল্প</NavLink> </div>
<div  className='bg-white w-full mt-1'><NavLink to="/self-profile" className='p-2 text-black text-2xl'>প্রোফাইল</NavLink> </div>

<div  className='bg-white w-full mt-1'><NavLink to="/login" className='p-2 text-black text-2xl'>লগইন/সাইনআপ</NavLink></div>


<div className='flex justify-between mt-1'>
  <button className='text-xl bangla_font inline-block px-2 py-2 mr-2 text-white bg-black rounded-full'>ডার্ক</button>
  <button className='text-xl bangla_font inline-block px-2 py-2 bg-white text-black rounded-full'>লাইট</button>
</div>

  </div>
}

{/* desktop view */}
<div className='bangla_font text-2xl p-5 pl-2.5 h-18 w-18 bg-cyan-300 rounded-full hidden lg:flex'>
কলম
</div>

<div className='text-2xl bangla_font text-shadow-2xs text-shadow-black hidden lg:flex'> 
<NavLink to="/" className='p-4 text-white hover:text-black'>হোম</NavLink>
<NavLink to="/story" className='p-4 text-white hover:text-black'>গল্প</NavLink> 
<NavLink to="/self-profile" className='p-4 text-white hover:text-black'>প্রোফাইল</NavLink> 
</div>

<div className='text-2xl bangla_font text-shadow-2xs text-shadow-black hidden lg:flex'>
<NavLink to="/login" className='p-4 text-white hover:text-black'>লগইন/সাইনআপ</NavLink>
</div>
<div className='p-4 hidden lg:flex'>
  <button className='text-xl bangla_font inline-block px-4 py-2 mr-2 text-white bg-black rounded-full'>ডার্ক</button>
  <button className='text-xl bangla_font inline-block px-4 py-2 bg-white text-black rounded-full'>লাইট</button>
</div>



    </header>

  )
}

export default Header

