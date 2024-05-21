import { useNavigate } from "react-router-dom"

const DeniedPage=()=>{
    const navigate=useNavigate()
return(
    <main className="grid min-h-full place-items-center h-[100vh]  px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-9xl font-semibold text-indigo-600">404 </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-red-700 sm:text-5xl">Access Denied</h1>
      <p className="mt-6 text-base leading-7 text-white">Sorry, you do not have the access for this page</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button onClick={()=>navigate(-2)} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back</button>
        
      </div>
    </div>
  </main>
)
}
export default DeniedPage