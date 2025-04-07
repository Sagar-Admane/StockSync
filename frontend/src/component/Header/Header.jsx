import React, { useContext, useState } from "react";
import style from "./header.module.scss"
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import {toast, ToastContainer} from "react-toastify"
import axios from "axios";
import context from "../../context/context";
import { useNavigate } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader"

function HeaderTop() {

  const {resSearch, setResSearch, setLoading, loading} = useContext(context);
  const navigate = useNavigate();
  const [searchStock, setSearchStock] = useState("");

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    async function handleSearch(e){
      e.preventDefault();
      if(!searchStock){
        toast.error("Search cannot be empty")
        return;
      }
      try {
        setLoading(true);
        const result = await axios.get(`http://localhost:5001/stock/search?query=${searchStock}`,{
          headers : {
            Authorization : `Bearer ${userInfo.token}`
          }
        })
        setLoading(false);
        if(result){
          console.log(result.data);
          setResSearch(result.data);
          navigate("/searchstock");
        }
      } catch (error) {
          console.log(error);
      }
    }

  return (
    <>
    <ToastContainer />
    <div className={style.header}>
      <div className={style.search}>
        <form onSubmit={handleSearch} >
        <FaSearch size={18} />
        <input type="text" placeholder="Search Your stock" onChange={(e) => setSearchStock(e.target.value)} />
        {loading ? <BounceLoader color="#ffffff" size={20} /> : null}
        
        </form>
      </div>
      <div className={style.profile}>
        <CgProfile size={26} />
        <p style={{ fontSize: "18px" }}>{userInfo.name}</p>
      </div>
    </div>
    </>
  );
}

export default HeaderTop;
