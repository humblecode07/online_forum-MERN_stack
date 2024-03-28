import useAuth from "./useAuth";
import axios from '../api/axios';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        setAuth(prev => {
            console.log("Prev: " + JSON.stringify(prev));
            console.log("r.d.roles: " + response.data.roles)
            return { 
              ...prev, 
              roles: response.data.roles,
              accessToken: response.data.accessToken
            }
        });

        return response.data.accessToken;
    }
    
  return (
    refresh
  )
}

export default useRefreshToken
