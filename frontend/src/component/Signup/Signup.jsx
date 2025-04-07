import React, { useContext, useState } from 'react'
import style from "./signup.module.scss"
import context from '../../context/context'
import axios from "axios"
import {toast, ToastContainer} from "react-toastify"
import { useNavigate } from 'react-router-dom'

function Signup() {

  const {login, setLogin} = useContext(context);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e){
    e.preventDefault();
    if(!email || !name || !password){
      toast.error("Fields cannot be empty")
    }
    try {
      const result = await axios.post("http://localhost:5001/user/signup", {
        email, name, password
      });
      if(result){
        console.log(result.data);
        localStorage.setItem("userInfo", JSON.stringify(result.data));
        navigate("/dashboard")
      }
      
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className={style.container} >
      <ToastContainer />
      <div className={style.header}>
        <p>Signup</p>
      </div>
      <div className={style.form}>
        <form>
          <div className={style.email} >
            <p>Email Address: </p>
            <input type="email" placeholder='Enter your email address' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={style.name} >
            <p>Name: </p>
            <input type="text" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={style.password} >
            <p>Password : </p>
            <input type="password" placeholder='Enter your password' onChange={(e) => setPass(e.target.value)} />
          </div>
          <div className={style.login} >
            <button onClick={handleSignup} >Signup</button>
          </div>
        </form>
        <p className={style.para} >Already a user? <span onClick={() => setLogin(true)} >Login</span></p>
      </div>
    </div>
  )
}

export default Signup
