import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
const NotFound = () => {
    const navigate = useNavigate()
  return (
       <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-24 text-center sm:py-32 lg:px-8">
        <Helmet>
    <title>Kolom | Page Not Found</title>
</Helmet>
      <div className="max-w-md">
        
        
        {/* Main Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        {/* Description */}
        <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
          Sorry, we couldn’t find the page you’re looking for. Check the URL or head back home.
        </p>
        
        {/* Action Button */}
        <div className="mt-10 flex items-center justify-center">
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition duration-200 ease-in-out transform active:scale-95 cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </main>
  )
}

export default NotFound
