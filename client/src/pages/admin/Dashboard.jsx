import React, { useEffect, useState } from 'react'
import { assets, dashboard_data } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [dashboardData,setDashboardData]=useState({
     blogs:0,
     comments:0,
     drafts:0,
     recentBlogs: []
    })
    
    const {axios} =useAppContext()

    const fetchDashboard=async ()=>{
        try{
         const token = localStorage.getItem("token");

         const { data } = await axios.get("/api/admin/dashboard", {
            headers: {
           Authorization: `Bearer ${token}`,
  },
});

         data.success ? setDashboardData(data.dashboardData) : toast.error(data.message) 
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchDashboard()
    },[])


  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 flex flex-col min-h-screen'>
  <div className='flex flex-wrap gap-4'>
    
    
    <div className='flex items-center gap-4 bg-white p-4 rounded shadow
     cursor-pointer hover:scale-105 min-w-[200px] transition-all'>
      <img src={assets.dashboard_icon_1} alt=""/>
      <div>
        <p className='text-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
        <p className='text-gray-400 font-light'>Blogs</p>
      </div>
    </div>

    
    <div className='flex items-center gap-4 bg-white p-4 rounded shadow 
    cursor-pointer hover:scale-105 min-w-[200px] transition-all'>
      <img src={assets.dashboard_icon_2} alt=""/>
      <div>
        <p className='text-xl font-semibold text-gray-600'>{dashboardData.comments}</p>
        <p className='text-gray-400 font-light'>Comments</p>
      </div>
    </div>

     <div className='flex items-center gap-4 bg-white p-4 rounded shadow 
     cursor-pointer hover:scale-105 min-w-[200px] transition-all'>
      <img src={assets.dashboard_icon_3} alt=""/>
      <div>
        <p className='text-xl font-semibold text-gray-600'>{dashboardData.drafts}</p>
        <p className='text-gray-400 font-light'>Drafts</p>
      </div>
    </div>
</div>

  <div>
    <div className='flex items-center gap-3 m-4 mt-6 text-gray-600 '>
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
                {dashboardData.recentBlogs.map((blog,index)=>{
                    return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index+1} />
                })}
            </tbody>
        </table>
    </div>
    <hr className="my-6 border-gray-300" />

<footer className="text-center text-gray-400 text-sm py-4">
  &copy; {new Date().getFullYear()} AdminLogic. All rights reserved.
</footer>

  </div>

</div>

  )
}

export default Dashboard