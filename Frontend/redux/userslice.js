import { createSlice } from "@reduxjs/toolkit";

export const UserSlice=createSlice({
    name:"user",
    initialState:{
        userData:undefined
    },
    reducers:{
        setUSerData:(state,action)=>{
state.userData=action.payload
        }
    }
})

export const {setUSerData}=UserSlice.actions
export default UserSlice.reducer