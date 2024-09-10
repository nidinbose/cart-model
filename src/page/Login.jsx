import React, { memo, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import axios from 'axios';

import { loginValidate } from "../helpers/validate";
import { GlobalContext } from "../context";
import "./style/login.css";

function Login() {
    const {setGlobal} = useContext(GlobalContext);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validate: loginValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
          console.log(values);
          const { username, password } = values;
            let loginPromise = axios.post("/api/login", {username, password } , {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            toast.promise(loginPromise, {
                loading: "Logging in...",
                success: (res) => {
                    setGlobal({
                        username: values.username,
                        type: res.data.type,
                        isLoggrdin: true
                    })
                    localStorage.setItem("token", res.data.token);
                    res.data.type == "seller" ? navigate("/profile") : navigate("/");
                    return res.data.msg;
                },
                error: (error) => error.response.data.msg
            })
        }
    });
    return (
        <div className='log-body-container'>
        <main className="log-faq">
        <div className="log-faq__logo__holder">
          <div className="log-faq__logo">
            <img
              src="https://bobmatyas.github.io/fm-faq-accordion/images/illustration-woman-online-mobile.svg"
              alt="woman at a computer"
              className="log-faq__logo__image hidden-lg"
            />
            <img
              src="https://bobmatyas.github.io/fm-faq-accordion/images/illustration-box-desktop.svg"
              alt=""
              className="log-faq__logo__image visible-lg"
            />
          </div>
        </div>
    
        <div className="log-faq__holder">
          <div className="log-main">
            <p className="log-sign" align="center"> Log in  </p>
            
            <form className="log-form1"  onSubmit={formik.handleSubmit}>

              <input {...formik.getFieldProps("username")} className="log-un" type="text" name="username" id="username" placeholder="username" /><br />
              <input {...formik.getFieldProps("password")} className="log-un" type="password" name="password" id="password" placeholder="password" /><br />
              <input type="submit" className="log-submit" value="register" />
              <p className='log-unn'>Don't have an account? <Link to={"/register"}>register</Link></p>
    
            </form>
          </div>
        </div>
      </main>
      </div>
    )

   
}

export default memo(Login);