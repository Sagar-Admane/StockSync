import React, { useEffect, useState } from 'react'
import style from "./wishlist.module.scss"
import axios from 'axios';

function Wishliststack() {

    const [wishlist, setWishList] = useState([]);

    async function getWishlist(){
        const data = JSON.parse(localStorage.getItem("userInfo"));
        try {
            const result = await axios.get("http://localhost:5001/wishlist/",{
                headers : {
                    Authorization : `Bearer ${data.token}`,
                }
            });
            if(result){
                setWishList(result.data);
            } else {
                console.log("Cannot get Wishlist");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getWishlist();
    }, [])

  return (
    <div className={style.container} >
      <p style={{fontSize : "22px"}}>Your Wishlist : </p>
      <div className={style.list}>
      {wishlist.length === 0 ? <p style={{fontSize : "16px", color : "grey"}} >Wishlist is empty</p> : 
        <>
        {wishlist.map((w) => {
            return(
                <div className={style.listItem} >
                    <p>{w}</p>
                </div>
            )
        })}
        </>
      }
      </div>
    </div>
  )
}

export default Wishliststack
