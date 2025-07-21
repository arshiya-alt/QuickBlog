import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'

const AddBlog = () => {

  const {axios} =useAppContext()
  const [isAdding,setIsAdding] =useState(false)
  const [loading,setloading] =useState(false)

  const editRef=useRef(null) 
  const quillRef=useRef(null)

  const [image,setImage]=useState(false);
  const [title,setTitle]=useState('');
  const [subTitle,setSubTitle]=useState('');
  const [category,setCategory]=useState('Startup');
  const [isPublished,setIsPublished]=useState(false);

 const generateContentAI = async () => {
  if (!title) return toast.error('Please enter a title');

  try {
    setloading(true);

    const token = localStorage.getItem("token"); // or from context

    const { data } = await axios.post(
      '/api/blog/generate',
      { prompt: title },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      quillRef.current.root.innerHTML = parse(data.content);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    setloading(false);
  }
};


  const generateContent=async ()=>{
      try {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Authorization token missing');
      return;
    }

    const { data } = await axios.post('/api/blog/generate', 
      { title, subTitle }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      quillRef.current.root.innerHTML = data.generatedContent; // Or however the backend returns it
      toast.success('Content generated!');
    } else {
      toast.error(data.message || 'Failed to generate content');
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
  }

  const onSubmitHandler =async(e) =>{
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image before submitting.");
      return;
    }

    try{
    setIsAdding(true)

    const blog={
      title,subTitle,
      description:quillRef.current.root.innerHTML,
      category,isPublished
    }

    const formData= new FormData();
    formData.append('blog',JSON.stringify(blog))
    formData.append('image',image)

    const token = localStorage.getItem('token');

    const { data } = await axios.post('/api/blog/add', formData, {
    headers: {
   Authorization: `Bearer ${token}`,
  },
});


    if(data.success){
      toast.success(data.message);
      setImage(false)
      setTitle('')
      quillRef.current.root.innerHTML=''
      setCategory('Startup')
    }else{
      toast.error(data.message)
    }
    }catch(error){
      toast.error(error.message)
    }finally{
     setIsAdding(false)
    }
  }
  
  useEffect(()=>{
    //Initiate quill only once
    if(!quillRef.current && editRef.current){
        quillRef.current=new Quill(editRef.current, {theme:"snow"})
    }
  },[])

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 
    text-gray-600 h-full overflow-scroll pb-20'>
    <div className='bg-white w-full max-w-3xl  p-4 md:p-10 shadow-rounded sm:m-10'>
        <p>Upload thumbnail</p>
        <label htmlFor="image">
            <img src={! image ? assets.upload_area : URL.createObjectURL(image) } alt="" className='mt-2 h-16
             rounded cursor-pointer'/>
             <input onChange={(e)=> setImage(e.target.files[0])}
              type="file" id="image" hidden name="image"/>
        </label>

     <p className='mt-4'>Blog title</p>
     <input type="text" placeholder='Type here' required 
     className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
      onChange={e=> setTitle(e.target.value)} value={title} />

       <p className='mt-4'>Subtitle</p>
     <input type="text" placeholder='Type here' required 
     className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
      onChange={e=> setSubTitle(e.target.value)} value={subTitle} />
      
      <p className='mt-4'>Blog Description</p>
      <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
        <div ref={editRef}></div>
        {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 mt-2">
        <div className="w-8 h-8 rounded-full border-2 border-t-white border-gray-300 animate-spin"></div>
        </div>
           )}

        <button disabled={loading} type='button' onClick={generateContentAI} 
        className='absolute bottom-1 hover:underline cursor-pointer
         ml-2 text-xs text-white bg-black/70 px-4 py-1.5 '>Generate with AI</button>
      </div>

    
      <p className='mt-4'>Blog Category</p> 
      <select onChange={e=> setCategory(e.target.value)} name="category" className='mt-2 px-3 border text-gray-500 border-gray-300
       outline-none rounded' >
        <option value="">Select category</option>
        {blogCategories.map((item,index)=>{
            return <option key={index} value={item}>{item}</option>
        })}
      </select>

     <div className='flex gap-2 mt-4'>
      <p>Publish Now</p>
      <input type="checkbox" checked={isPublished} className='scale-125
      cursor-pointer' onChange={e=> setIsPublished(e.target.checked)}/>
     </div>
     
     <button disabled={isAdding} type="submit" className='mt-8 bg-primary text-white rounded cursor-pointer text-sm h-10 w-40'>
        {isAdding ? 'Adding...' : 'Add Blog' }
        </button>

    </div>
    </form>
  )
}

export default AddBlog