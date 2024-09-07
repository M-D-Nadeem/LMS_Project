
# Project Title

LMS- Learning Management System 

The Learning Management System (LMS) project is a user-friendly website designed to provide an affordable and structured platform for users to purchase and consume courses. The website ensures that lectures are presented in an orderly and organized manner, enhancing the learning experience for users.

In addition to the user-centric features, the LMS includes a comprehensive admin dashboard. This dashboard allows administrators to efficiently manage the platform by adding and deleting lectures, as well as monitoring user engagement. The dashboard provides graphical representations of user registrations and subscriptions, offering insightful analytics to help improve and manage the courses.




## Features
User Features
- User Authentication: User can securely login and signup with password encryption while storing in mongodb atlas
- Affordable Courses: Users can purchase the subscription at minimal prices and all the enjoy all the Courses available
- Organized Lecture Consumption: Lectures are presented in a structured and sequential format for optimal learning.

Admin Features

- Course Management: Admins can add and delete lectures to keep course content up-to-date.
- User Analytics: View graphical representations of user registrations and course subscriptions.
- Insightful Dashboard: Monitor and manage user engagement with comprehensive analytics.



## Tech Stack

**Client:** 

Tailwind CSS & DaisyUI: For modern, responsive, and accessible design.

React: For building the dynamic user interface.

Redux: For state management.

Axios: For making HTTP requests.

**Server:** 

Node and Express.js: For backend development.

MongoDB: For database management.

bcrypt: For password hashing.

Cloudinary: For image and video storage.

Razorpay: For payment integration.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- MongoDB connection string
`MONGO_URI`

- JWT secret key for authentication
`JWT_SECRET_CODE`
`JWT_EXPIRY`

- Cors origin
`CLIENT_URL`

- Cloudinary credentials for image and video storage
`CLOUD_NAME`
`API_KEY`
`API_SECRET`

- Email service credentials for sending emails
`SMTP_HOST`
`SMPT_POST`
`SMPT_USERNAME`
`SMPT_PASSWORD`
`SMPT_FROM_EMAIL`

- Razorpay credentials for payment integration
`RAZORPAY_KEY_ID`
`RAZORPAY_SECRET_KEY`
`RAZORPAY_OFFER_ID`

- For creating axios instance to connect frontend with backend
`VITE_BASE_URL`


## Installation


Follow these steps to set up the project on your local machine:

Prerequisites
- Ensure you have react with vite, Node.js and npm installed on your system.
- Make sure you have MongoDB installed and running.

Clone the Repository

```bash
git clone https://github.com/M-D-Nadeem/LMS_Project.git
cd LMS_Project
```

Install Dependencies

- Install the backend dependencies

```bash
  cd server
  npm install 
  cd..
```
- Install the frontend dependencies
    
```bash
  cd lms-frontend
  cd vite-project
  npm install 
  cd..
```
## Deployment

To runb this project

Start the backend server:

```bash
  cd server
  npm run start
```

Start the frontend development server:

```bash
  cd lms-frontend
  cd vite-project
  npm run start
```


## Authors

- [@MD Nadeem](https://github.com/M-D-Nadeem)


## Demo


[https://youtu.be/mBHtcaEGvSc](https://youtu.be/mBHtcaEGvSc)
