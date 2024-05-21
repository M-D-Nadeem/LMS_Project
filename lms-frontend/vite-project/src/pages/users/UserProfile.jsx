
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../../redux/Slice/authSlice";
import toast from "react-hot-toast";
import { cancelSubscription } from "../../redux/Slice/paymentSlice";

const UserProfile=()=>{
    const navigate=useNavigate()
    const {data}=useSelector((store)=>store.auth)
    const dispatch=useDispatch()
    
    async function handelChancelSubscription(){
        toast("Initiating cancellation")
        const response=await dispatch(cancelSubscription())
        console.log(response);
        await dispatch(getUserData())
        toast.success("Cancellation completed!")
        navigate("/")
    }
    console.log(data);
    return(
        <div className="min-h-[90vh] flex items-center justify-center ">
           
           <div className="rounded-lg shadow-[0_0_10px_black] text-white  flex flex-col gap-7">
            <div className="flex flex-col py-2 justify-center items-center gap-2">
                <img src={data?.avtar?.secure_url} className="rounded-full w-36 h-36"></img>

                <h1 className="text-xl font-bold text-center capitalize">
                    {data.fullName}
                </h1>
            </div>
            <div className="grid grid-cols-2 px-5 text-lg">
                <p>Email:</p><p>{data.email}</p>
                <p>Role:</p><p>{data.role}</p>
                <p>Subscription:</p><p>{(data?.subscription?.status==="active")?"Active":"Inactive"}</p>
            </div>

            <div className="px-5">
                <div className="flex gap-3 py-2">
                    <Link to="/changepassword"
                    className="bg-yellow-500 w-1/2 text-xl font-bold text-center py-2 rounded-sm cursor-pointer hover:bg-yellow-400 transition-all ease-in-out duration-300">
                        <button>Change Password</button>
                    </Link>

                    <Link to="/editprofile"
                    className="bg-yellow-500 w-1/2 text-xl font-bold text-center py-2 rounded-sm cursor-pointer hover:bg-yellow-400 transition-all ease-in-out duration-300">
                        <button>Edit Profile</button>
                    </Link>
                </div>
                <div className="py-2">
                    {(data?.subscription?.status==="active") && (
                        <button onClick={handelChancelSubscription}
                        className="bg-red-500 text-xl w-full font-bold text-center py-2 rounded-sm cursor-pointer hover:bg-red-400 transition-all ease-in-out duration-300">
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </div>
            </div>
        </div>
    )
}
export default UserProfile