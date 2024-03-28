import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Users = () => {
  const [users, setUsers] = useState([]);

  const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
    
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                const userData = response.data.users.map(user => ({
                    user_name: user.user_name,
                    _id: user._id
                }));
                isMounted && setUsers(userData);
            } catch (err) {
                console.log(err)
                navigate('/admin/login', { state: { from: location }, replace: true });
            }
        }
    
        getUsers();
    
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

  return (
      <article>
          <h2>Users List</h2>
          {users?.length ? 
              (<ul>
                  {users.map((user) => <li key={user._id}>{user.user_name}</li>)}
              </ul>)
              : <p>No users found</p>}
      </article>
  );
};


export default Users
