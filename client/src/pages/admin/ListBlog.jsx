import React, { useEffect, useState } from 'react'
import { assets,blog_data } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../../context/AppContext'
import toast from 'react-hot-toast'

const ListBlog = () => {
    const [blogs,setBlogs] = useState([])
    const {axios} =useAppContext()

    const fetchBlogs =async () =>{
        try{
         const token = localStorage.getItem('token');
         const { data } = await axios.get('/api/admin/blogs', {
        headers: {
        Authorization: `Bearer ${token}`,
  },
});

        if(data.success){
            setBlogs(data.blogs)
        }else{
            toast.error(data.message)
        }
        }catch(error){
            toast.error(error.message)
        }
    }
    useEffect(()=>{
       fetchBlogs() 
    },[])
  return (
    <div className='flex-1 pt-5 px-5 sm:pl-16 bg-blue-50/50'>
     <h1>All blogs </h1>

     <div>
         
    <div className='flex items-center h-4/5 gap-3 m-4 mt-6 text-gray-600 '>
        <img src={assets.dashboard_icon_4} alt=""/>
        <p>Latest Blogs</p>
    </div>
    <div className='relative max-w-4xl shadow rounded-lg scrollbar-hidden bg-white'>
        <table className='w-full text-sm text-gray-500 '>
            <thead className='text-xs text-gray-600 text-left uppercase'>
                <tr>
                    <th scope='col' className='px-2 py-4'> #</th>
                    <th scope='col' className='px-2 py-4'> Blog Title</th>
                    <th scope='col' className='px-2 py-4'> Date</th>
                    <th scope='col' className='px-2 py-4'> Status</th>
                    <th scope='col' className='px-2 py-4'>Actions </th>
                </tr>
            </thead>

            <tbody>
                {blogs.map((blog,index)=>{
                    return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index+1} />
                })}
            </tbody>
        </table>
    </div>
     </div>
    </div>
  )
}

export default ListBlog