import React from 'react'
import logo from "../../assets/white.svg";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { MdContactSupport } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import style from "./left.module.scss"

function Left() {
  return (
    <div className={style.container} >
      <div className={style.logo}>
                <img src={logo} alt="" />
                <p>StockSync</p>
              </div>
              <div className={style.menu}>
                <div>
                  <MdSpaceDashboard size={22} />
                  <p>Dashboard</p>
                </div>
                <div>
                  <AiOutlineStock size={22} />
                  <p>Wishlist</p>
                </div>
                <div>
                  <MdContactSupport size={22} />
                  <p>Contact Us</p>
                </div>
                <div>
                  <CgProfile size={22} />
                  <p>Profile</p>
                </div>
                <div>
                  <HiOutlineLogout size={22} />
                  <p>Logout</p>
                </div>
              </div>
    </div>
  )
}

export default Left
