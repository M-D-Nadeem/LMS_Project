import { useEffect } from "react"
import {FaUsers} from "react-icons/fa";
import {FcSalesPerformance} from "react-icons/fc"
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux"
import { getUserData } from "../../redux/Slice/dashboardSlice"
import { getAllSubscription } from "../../redux/Slice/paymentSlice"
import { deleteCourse, getAllCourses } from "../../redux/Slice/courseSlice"
import {Bar, Pie} from "react-chartjs-2"
import {Chart as ChartJs, ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,Title} from "chart.js"
import { useLocation, useNavigate } from "react-router-dom"
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
 ChartJs.register(ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,Title)
const Dashboard=()=>{
    const dispatch=useDispatch()
    const location=useLocation()
    const navigate=useNavigate()
    const {noOfUser,noOfActiveUser}=useSelector((store)=>store.dashboard)
    const {allPayments,finalMonths,monthlySalesRecord}=useSelector((store)=>store.payment)
    const courseData=useSelector((store)=>store.courses.courseData)
    async function fetchAllData(){
        await dispatch(getUserData())
        await dispatch(getAllSubscription())
        await dispatch(getAllCourses())
    }

     const chartData={
        labels:["Registered User","Entrolled User"],
        fontColor: "white",
        datasets:[
            {
                label:"User Detailes",
                data:[noOfUser,noOfActiveUser],
                backgroundColor:["yellow","green"],
                borderColor:["yellow","green"],
                borderWidth:1
            }
        ]
     }
     const salesData={
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        fontColor:"white",
        datasets:[
            {
                label:"Sales / Month",
                data:monthlySalesRecord,
                backgroundColor:["red"],
                borderColor:["white"],
                borderWidth:2
            }
        ]
     }

    
    useEffect(()=>{
        let intervalId
        // console.log(location.pathname);
        fetchAllData()
        if(location.pathname==="/admin/dashboard"){
            intervalId= setInterval(fetchAllData,600000)
        }
        else{
            clearInterval(intervalId);
        }
        
        return () => {
            // Cleanup interval on component unmount or if location changes
            clearInterval(intervalId);
          };
    },[])

    async function handelDeleteCourse(id){
    if(window.confirm("Are you sure you want to delete the course ? ")) {
      const response=await dispatch(deleteCourse(id))
      if(response?.payload?.sucess){
        await dispatch(getAllCourses())
      }
    }
    }
    console.log(chartData.datasets[0].data);
    console.log(allPayments);
    console.log(finalMonths);
    console.log(monthlySalesRecord);
    console.log(courseData);
    return(
        <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
                <h1 className="text-center text-5xl font-semibold text-yellow-500">
                    Admin Dashboard
                </h1>

            
                <div className="flex p-3 gap-5 m-auto mx-10">
                    {/* Pie chart */}
                    <div className="flex w-1/2 flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                        <div className="w-1/2 h-80 flex items-center justify-center">
                            <Pie data={chartData}/>
                        </div>
                        <div className="flex gap-5">
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold">Registered Users</p>
                                    <h3 className="text-4xl font-bold">{noOfUser}</h3>
                                </div>
                                <FaUsers className="text-yellow-500 text-5xl"/>
                            </div>
                        
                        
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                <p className="font-semibold">Subscribed Users</p>
                                <h3 className="text-4xl font-bold">{noOfActiveUser}</h3>
                        </div>
                        <FaUsers className="text-green-500 text-5xl"/>
                        </div>
                    </div>
                    </div>
                        {/* Bar chart */}
                    <div className="flex w-1/2 flex-col p-5 gap-10 items-center shadow-lg rounded-md">
                        <div className="w-full h-80 flex items-center justify-center">
                            <Bar className="h-80 relative top-10" data={salesData} />
                        </div>

                    <div className="flex gap-5 ">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Subscription Count</p>
                            <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
                            </div>
                            <FcSalesPerformance className="text-yellow-500 text-5xl"/>
                        </div>

                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Revenue</p>
                            <h3 className="text-4xl font-bold">{allPayments?.count *499}</h3>
                            </div>
                            <GiMoneyStack className="text-green-500 text-5xl"/>
                        </div>
                    </div>
                    </div>
                   </div>
         
                  <div className="px-12">
                     <div className="flex justify-between items-center">
                        <h1 className="text-center font-semibold text-3xl">
                            Courses overview
                        </h1>
                        <button className="text-center bg-yellow-500 w-fit hover:bg-yellow-400 transition-all ease-in-out duration-300 text-lg font-semibold py-4 px-2 rounded-xl"
                                 onClick={()=>navigate("/course/create")}>
                                    Create new course
                        </button>
                     </div>

<div className="mt-5">
  <table className="table overflow-x-scroll">
    {/* head */}
    <thead>
      <tr>
      <th>Sl no.</th>
      <th>Course title</th>
      <th>Description</th>
      <th>Instructor</th>
      <th>Total lectures</th>
      <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {courseData.map((ele,idx)=>{
        return(
            <tr key={ele._id}>
                <td>{idx+1}</td>
                <td>
                <div className="flex items-center gap-3">
               <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img src={ele.thumbnail.secure_url} />
              </div>
            </div>
            <div>
              <div className="font-bold">{ele.title}</div>
              <div className="text-sm opacity-50 max-w-40 overflow-hidden  ">{ele.category}</div>
            </div>
          </div>
        </td>

        <td className="max-w-44 overflow-hidden  ">
         {ele.description}</td>

        <td>{ele.createdBy}</td>

        <td>{ele.numberOfLectures}</td>

        <td className="flex items-center gap-4">
        <button
            className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
            onClick={() => navigate("/course/displaylecture", {state: {courseData:ele}})}
        >
            <BsCollectionPlayFill />
        </button>
        <button
            className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
            onClick={()=>handelDeleteCourse(ele._id)}
        >
            <BsTrash />
        </button>
    </td>
</tr>
        )
      })}
    </tbody>
  
  </table>
</div>
</div>
 </div> 
    )
}
export default Dashboard