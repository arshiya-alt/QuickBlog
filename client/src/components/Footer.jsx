import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 '>
       <div className="w-full max-w-2xl">
        <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
        <p className='text-gray-500/70 pb-8'> Subscribe to get the latest blog, new tech, and exclusive news.</p>
        <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'> 
        <input  className='border border-gray-300 rounded-md h-full border-r-0 outline-none
         w-full rounded-r-none px-3 text-gray-500 ' type="text" placeholder='Enter your email id' required ></input>
        <button type='submit' className='md:px-12 px-8 h-full text-white bg-primary rounded-1-none'>
            Subscribe
        </button>
        </form>
    </div>
    
       
        <p className=' py-20 text-center text-sm md:text-base text-gray-500'>Copyright 2025 © QuickBlog - All Right Reserved. </p>
    </div> 
  
    
  )
}

export default Footer