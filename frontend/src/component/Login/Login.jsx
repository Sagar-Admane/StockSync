import React, { useContext, useEffect, useState } from 'react'
import style from "./login.module.scss"
import context from '../../context/context'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

  const {login, setLogin} = useContext(context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const data = localStorage.getItem("userInfo");
    if(data){
      navigate("/dashboard");
    }
  })

  async function handleClick(e){
    e.preventDefault();
    if(!email || !password){
      toast.error("Fields are empty");
    }

    try {
      const result = await axios.post("http://localhost:5001/user/login", {
        email,
        password
      })
      if(result){
        console.log(result.data);
        localStorage.setItem("userInfo", JSON.stringify(result.data));
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className={style.container} >
      <div className={style.header}>
        <p>Login</p>
      </div>
      <div className={style.form}>
        <form>
          <div className={style.email} >
            <p>Email Address: </p>
            <input type="text" placeholder='Enter your email address' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={style.password} >
            <p>Password : </p>
            <input type="password" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className={style.login} >
            <button onClick={handleClick} >Login</button>
          </div>
        </form>
        <p className={style.para} >New user? <span onClick={() => setLogin(false)} >Sign Up</span></p>
      </div>
    </div>
  )
}

export default Login
