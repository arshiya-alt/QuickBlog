import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import { assets} from '../assets/assets'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
   const {id} = useParams()
  
   const {axios} =useAppContext()

   const [data,setData]=useState(null)
   const [comments,setComment]=useState([])
   const [name,setName] =useState('')
   const [content,setContent]=useState('')

    const navigate=useNavigate();

   const fetchBlogData= async ()=>{
   try{
    const {data} =await axios.get(`/api/blog/${id}`)
    data.success ? setData(data.blog) : toast.error(data.message)
   }catch(error){
     toast.error(error.message)
   }
}

     const fetchComments = async () => {
    try {
    const res = await axios.post("/api/blog/comments", { blogId: id });

    if (res?.data?.success) {
      setComment(res.data.comments);
    } else {
      console.error(res?.data?.message || "Failed to fetch comments");
    }
  } catch (error) {
    console.error("Error fetching comments", error.message);
  }
};



  
   
   const addComment=async(e)=>{
    e.preventDefault();
    try{
     const {data} = await axios.post('/api/blog/add-comment',{blog: id,name,content })
     if(data.success){
      toast.success(data.message)
      setName('')
      setContent('')
     }else{
      toast.error(data.message);
     }
    }catch(error){
     toast.error(error.message)
    }
   }
   useEffect(()=>{
    fetchBlogData()
    fetchComments() 
   },[])

   
  if (data === 'not-found') {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-gray-600'>
        <h1 className='text-2xl font-bold mb-4'>Blog Not Found</h1>
        <p className='mb-4'>The blog you're looking for doesn't exist.</p>
        <a href="/" className='text-blue-500 underline'>Go Back Home</a>
      </div>
    );
  }

  return data ?(
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
      <Navbar />

        <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className=' text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 text-sm border-gray-100 bg-blue-200 font-medium '>{data.author}</p>
        </div>
        
        <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
          {/*image to added */}
          <img src={data.image}  alt="" className='w-full max-h-[600px] object-cover rounded-3xl mb-5'/>

          {/*description */}
          <div className='rich-text max-w-3xl' dangerouslySetInnerHTML={{__html: data.description}}></div>
          {/*Comments section */}
          <div className='mt-14 mb-10 max-w-3xl mx-auto'>
              <p className='font-semi-bold mb-4' >Comments ({comments.length})</p>

              <div className='flex flex-col gap-4'>
                {comments.map((item,index)=>(
                  <div key={index} className='relative bg-primary/2 border border-primary/5
                  text-gray-600 rounded p-4 max-w-xl'>
                    <div className='flex items-center gap-2'>
                    <img src={assets.user_icon} alt="" className='w-6' />
                    <p className='font-medium'>{item.name}</p>
                    </div>

                    <p className='text-sm ml-8 max-w-md'>{item.content}</p>
                    <div className='text-xs ml-105'>{Moment(item.createdAt).fromNow()}</div>
                    </div> 
                ))}
              </div>
          </div>

          {/*add input comment section*/}
          <div className='max-w-3xl mx-auto'>
            <p className='text-semibold'>Add your comment</p>
           <form onSubmit={addComment} className='flex flex-col gap-4'>
             <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className='border border-gray-300 p-2'/>
             <textarea  onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' className='border border-gray-300 rounded h-48' />
             <button  type="submit" className='bg-primary text-white text-sm py-1 rounded w-20 cursor-pointer  transition-all'>Submit</button>
           </form>

          </div>
          <div className='my-24 max-w-3xl mx-auto'>
            <p className='font-semibold my-4'>Share this article on social media</p>
            <div className='flex'>
           <img src={assets.facebook_icon} width={50} alt="" />
           <img src={assets.twitter_icon} width={50} alt="" />
           <img src={assets.googleplus_icon} width={50} alt="" />
           </div>
          </div>
        </div>
        <Footer />
    </div>
  ) : <div>
      <Loader />
  </div>
}

export default Blog