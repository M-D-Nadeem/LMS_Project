
import { useDispatch, useSelector } from "react-redux"
import { buySubscription, getRazorpayId, varifySubscribtion } from "../../redux/Slice/paymentSlice"
import { useEffect, useState } from "react"
import { BiRupee } from "react-icons/bi";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const CheckOut=()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {fullName,email}=useSelector((store)=>store.auth.data)
    const paymentDetails={
        payment_id:"",
        signature:"",
        subscription_id:""
    }

    //on load each time the page load we get the key and subId and then store it
    //M1 to set key and subId if we choose this then we not need to add builder for
    //getRazorpayId() and buySubscription()
    //because the task of builder is to chane the corrent state but here we are not using 
    //useSelector to fetch data from store

    // let [key,setKey]=useState("")
    // const [subscription_id,setSubscription_id]=useState("")
    // async function load(){
    //     const res1=await dispatch(getRazorpayId())
    //     const res2=await dispatch(buySubscription())
    //     setKey(res1?.payload?.key)
    //     setSubscription_id(res2?.payload?.subscriptionId)
    // }

    //M2
    //NOTE useDispatch does not rerender the component but if 
    //we have useSelector and if the redux store changes then it re render the useSelector
    const key=useSelector((store)=>store.payment.key)
    const subscription_id=useSelector((store)=>store.payment.subscription_id)
    async function load(){
        await dispatch(getRazorpayId())
        await dispatch(buySubscription())
    }
    useEffect(()=>{
        load()
    },[])
    
   async function handelSubscribe(e){
        e.preventDefault()
        if(!key || !subscription_id){
            toast.error("Something went wrong")
            return
        }
        //We will have to provide this option containing the configurations to 
        // window.Razorpay
        const option={
            key:key, 
            subscription_id:subscription_id,
            name: 'Coursify Pvt. Ltd.',
            description: 'Subscription',
            amount:499000,
            currency:"INR",
            theme: {
                color: '#F37254'
            },
            prefill:{
               email:email,
               name:fullName
            },
            //response will contain payment_id,signature,subscription_id which we need
            //provide to varifySubscribtion in backend to verifiy the payment signature
            //using cripto hashing, once we are getting this all info means we 
            //payment success new we need to verefy subscription imidiately after
            //payment so dispatch varifySubscribtion 
              handler:async function (response){
                // console.log(response);
                paymentDetails.payment_id=response.razorpay_payment_id
                paymentDetails.signature=response.razorpay_signature
                paymentDetails.subscription_id=response.razorpay_subscription_id

                toast.success("Payment successfull")

                const res=await dispatch(varifySubscribtion(paymentDetails))
                // console.log(res);
                 //This varifySuvhbscribtion return sucess and message field from backend
                if(res?.payload?.sucess){
                    toast.success(res?.payload?.message)
                    navigate("/checkout/success")
                }
                else{
                    toast.error(res?.payload?.message)
                    navigate("/checkout/fail")
                }
              }
        }
        const paymentObject=new window.Razorpay(option)
        paymentObject.open()

    }
    return(
        <form onSubmit={handelSubscribe} className="min-h-[90vh] flex justify-center items-center text-white">
           <div className="w-80 flex flex-col justify-center items-center  rounded-lg shadow-[0_0_10px_black]">
               <h1 className="font-bold text-2xl py-4 rounded-tr-lg rounded-tl-lg w-full bg-yellow-500 text-center">Subscription Bundle</h1>

               <div className="px-4 text-center py-4">
                <p className="text-[17px] leading-7">This purchase will allow you to access all available course
                            of our platform for{" "}<span className="text-yellow-500 font-bold">1 Year duration</span>
                            {" "}All the existing and new launched courses will be also available</p>
               </div>
               <h1 className=" text-2xl flex items-center gap-2 justify-center font-bold text-yellow-500 text-center">
                <BiRupee /> <span>499 Only</span> 
               </h1>

               <div className="text-gray-200 py-4 text-center">
                <p>100% refund on cancellation</p>
                <p>* Terms and conditions applied *</p>
               </div>

               
                <button type="submit"
                className="w-full bg-yellow-500 py-2 text-center rounded-br-lg rounded-bl-lg font-bold text-xl hover:bg-yellow-400 transition-all ease-in-out duration-300">
                Buy now
                </button>
               
           </div>
        </form>
    )
}
export default CheckOut