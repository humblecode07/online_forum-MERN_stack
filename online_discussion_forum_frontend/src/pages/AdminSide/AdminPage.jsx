import Users from './Users';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const AdminPage = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/admin/login');
    }

    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <Users />
            <br />

            <button onClick={signOut}>Sign out</button>
        </section>
    )
}

export default AdminPage