import nodemailer from "nodemailer" 

//Copy and paste the code from nodemailer library reffer https://nodemailer.com/


//Created account in email api to recieve the email , when you will creatye an account 
//you will be provide with smpt host ,smpt post, smpt username smpt password ans smpt from email
const sendemail=async function(email,subject,message){
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  
  port: process.env.SMPT_POST,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMPT_USERNAME,
    pass: process.env.SMPT_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
await transporter.sendMail({ 
    from: email, // sender address
    to: process.env.CONTACT_US_EMAIL, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html:message, // html body
  });


  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
export default sendemail