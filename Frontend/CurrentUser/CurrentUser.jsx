import axios from "axios";
import { useEffect } from "react";
import { ServerUrl } from "../config/backendUrl";
import { useDispatch, useSelector } from "react-redux";
import { setUSerData } from "../redux/userslice";

export default function CurrentUser() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

  useEffect(() => {
  const GetCurrentUser = async () => {

    if (userData !== undefined) return;

    try {
      const result = await axios.get(`${ServerUrl}/api/user/me`, {
        withCredentials: true
      });

      dispatch(setUSerData(result.data));

    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(setUSerData(null)); 
      }
    }
  };

  GetCurrentUser();
}, [dispatch, userData]);
    
    return null;
}