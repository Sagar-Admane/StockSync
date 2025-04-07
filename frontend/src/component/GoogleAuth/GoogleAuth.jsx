import React, { useState, useEffect, useCallback } from "react";
import style from "./google.module.scss";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import google from "../../assets/google.svg";
import fb from "../../assets/fb.png";
import mail from "../../assets/icons.svg";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

  async function handleClick() {
    console.log("triggering handleclick");
    if (!email || !name || !id) {
      toast.error("Some error while signing up with Google");
      return;
    }
    
    try {
      const result = await axios.post("http://localhost:5001/auth/", {
        email,
        name,
        id
      });
      console.log(result);
      localStorage.setItem("userInfo", JSON.stringify(result.data));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(email && name && id) {
      handleClick();
    }
  }, [email, name, id]);

  const handleAuth = useGoogleLogin(
    useCallback({
      onSuccess: async (res) => {
        console.log(res);
        try {
          const resp = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
              Authorization: `Bearer ${res.access_token}`
            }
          });
          console.log(resp.data);
          setEmail(resp.data.email);
          setName(resp.data.name);
          setId(resp.data.id);
        } catch (error) {
          console.log(error);
        }
      },
      onError: () => console.log("Error in using Google login")
    }, [])
  );

  return (
    <>
      <ToastContainer />
      <div className={style.container}>
        <p className={style.head}>OAuth</p>
        <div className={style.google}>
          <button onClick={() => handleAuth()}>
            <img src={google} alt="" />
            Continue with Google
          </button>
          <button>
            <img src={fb} alt="" />
            Continue with Facebook
          </button>
          <button>
            <img src={mail} alt="" />
            Continue with Mail
          </button>
        </div>
        <p className={style.footer}>
          By signing up, you agree to the <span className={style.terms}>Terms of Service</span> <br /> 
          and acknowledge you’ve read our <span className={style.policy}>Privacy Policy</span>
        </p>
      </div>
    </>
  );
}

export default Auth;
