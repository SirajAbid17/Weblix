import {configureStore} from "@reduxjs/toolkit"
import UserSlice from "./userslice"


export const store=configureStore({
    reducer:{
       user:UserSlice
    },
     devTools: true,
})