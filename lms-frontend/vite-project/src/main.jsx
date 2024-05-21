import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/strore.js'
import "./index.css"

import HomePage from './pages/HomePage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import CourseList from './pages/courses/CourseList.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import DeniedPage from './pages/DeniedPage.jsx'
import CourseDiscriptionPage from './pages/courses/CourseDiscriptionPage.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import CreateCourse from './pages/courses/CreateCourses.jsx'
import UserProfile from './pages/users/UserProfile.jsx'
import EditProfile from './pages/users/EditProfile.jsx'
import CheckOut from './pages/Payment/CheckOut.jsx'
import CheckOutSuccess from './pages/Payment/CheckOutSuccess.jsx'
import CheckOutFail from './pages/Payment/CheckOutFail.jsx'
import DisplayLectures from './pages/courses/DisplayLectures.jsx'
import AddLecture from './pages/courses/AddLecture.jsx'
import Dashboard from './pages/adminDashboard/Dashboard.jsx'

const appRouter=createBrowserRouter([
  {
    path:"/",
    element: 
    <Provider store={store} >
    <>
    <App />
    <Toaster />
    </>
    </Provider>,
    children:[
  {
    path:"/",
    element:<HomePage />
  },
  {
    path:"/about",
    element:<AboutUsPage />
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/course",
    element:<CourseList /> 
  },
  {
    path:"/course/discription",
    element:<CourseDiscriptionPage />
  },
  {
    path:"/contact",
    element:<ContactUsPage />
  },
  {
    path:"/denied",
    element:<DeniedPage />
  },
  {
    element:<RequireAuth allowedRoles={["ADMIN"]} />,
    children:[
      {
      path:"/course/create",
      element:<CreateCourse />
    },
    {
      path:"/admin/dashboard",
      element:<Dashboard />
    }
    ]
},
    {
      element:<RequireAuth allowedRoles={["ADMIN","USER"]} />,
      children:[
        {
          path:"/user/profile",
          element:<UserProfile />
        },
        {
          path:"/editprofile",
          element:<EditProfile />
        },
        {
          path:"/checkout",
          element:<CheckOut />
        },
        {
          path:"/checkout/success",
          element:<CheckOutSuccess />
        },
        {
          path:"/checkout/fail",
          element:<CheckOutFail />
        },
        {
          path:"/course/displaylecture",
          element:<DisplayLectures />
        },
        {
          path:"/course/addlecture",
          element:<AddLecture />
        }
      ]
    }
],
errorElement:<NotFoundPage />,


  },

  
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter} />
)
