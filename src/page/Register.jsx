import React, { memo, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useNavigate, Link } from "react-router-dom";

import { registerValidate } from "../helpers/validate.js";
import { convertToBase64 } from "../helpers/convert.js";
import "./style/register.css"
import axios from 'axios';


function Register() {
  const imageRef = useRef();
  const navigate = useNavigate();
  const imageHandler = (event) => {
    convertToBase64(event.target.files[0])
    .then(base64Image => {
      imageRef.current.src = base64Image;
      formik.setFieldValue("image", base64Image);
    })
    .catch(() => {
      toast.error("Failed to load image!")
    })
  }
  const formik = useFormik({
    initialValues: {
      image: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      cpassword: ""
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let responsePromise = axios.post("/api/register", values);
      toast.promise(responsePromise,{
        loading: "Registering...",
        success: (res) => {
          navigate("/login");
          return res.data.msg;
        },
        error: (res) => res.response.data.msg
      })
    }
  }); 
  return (
 <div className='reg-body-container'>
 <main className="register-faq">
    <div className="register-faq__logo__holder">
      <div className="register-faq__logo">
        <img
          src="https://bobmatyas.github.io/fm-faq-accordion/images/illustration-woman-online-mobile.svg"
          alt="woman at a computer"
          className="register-faq__logo__image hidden-lg"
        />
        <img
          src="https://bobmatyas.github.io/fm-faq-accordion/images/illustration-box-desktop.svg"
          alt=""
          className="register-faq__logo__image visible-lg"
        />
      </div>
    </div>

    <div className="register-faq__holder">
      <div className="register-main">
        <p className="register-sign" align="center"> Sign in  </p>
        
        <form className="register-form1" onSubmit={formik.handleSubmit}>
         
         

            <div className="register-avatar-container">
              <img src="/avatar.png" alt="avatar" ref={imageRef} />
              <label htmlFor="avatar">
                <span>
                  <img src="/edit-icon.png" alt="edit icon" />
                </span>
              </label>
            </div>

            
          <input onChange={imageHandler} type="file" name="avatar" id="avatar" accept="image/*" /><br />
          <input {...formik.getFieldProps("username")} className="register-un" type="text" name="username" id="username" placeholder="username" /><br />
          <input {...formik.getFieldProps("phone")} className="register-un" type="tel" name="phone" id="phone" placeholder="phone" /><br />
          <input {...formik.getFieldProps("email")} className="register-un" type="text" name="email" id="email" placeholder="email" /><br />
          <input {...formik.getFieldProps("password")} className="register-un" type="password" name="password" id="password" placeholder="password" /><br />
          <input {...formik.getFieldProps("cpassword")} className="register-un" type="password" name="cpassword" id="cpassword" placeholder="confirm password" /><br />
          <input type="submit" className="register-submit" value="register" />
          <p className='register-unn'>Already have an account? <Link to={"/login"}>login</Link></p>

        </form>
      </div>
    </div>
  </main>
  </div>
  )
  
}

export default Register;