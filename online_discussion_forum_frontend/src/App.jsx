import { Route, NavLink, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';

import Layout from './pages/Layout';
import RequireAuth from './pages/AdminSide/AdminRequireAuth';
import PersistLogin from './pages/PersistLogin';

import Home from './pages/UserSide/Home';
import Login from './pages/UserSide/Login';
import ComSci from './pages/UserSide/Forums/ComSci';

import AuthLogin from './pages/AdminSide/AuthLogin';
import AdminPage from './pages/AdminSide/AdminPage';
import Dashboard from './pages/AdminSide/Dashboard';
import AdminForums from './pages/AdminSide/Forums';
import AdminThreads from './pages/AdminSide/Threads';
import AdminComments from './pages/AdminSide/Comments';
import AdminUsers from './pages/AdminSide/Users'
import AdminReports from './pages/AdminSide/Reports';

import Missing from './pages/Missing';
import Unauthorized from './pages/Unauthorized';
import { PostProvider } from './context/PostContext';

const router = createBrowserRouter(
  createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin/login' element={ <AuthLogin />} />  
          <Route path='/forums/65ed796cd86faed84a62706e' element={<ComSci />} />

          {/* Admin */}
          <Route element={<PersistLogin />}>
            <Route element ={<RequireAuth allowedRoles={["Admin"]}/>}>
              <Route path='/admin/' element={<AdminPage />}> 
                <Route path='/admin/dashboard' element={<Dashboard />} />    
                <Route path='/admin/forums' element={<AdminForums />} />
                <Route path='/admin/:forumId/threads/' element={<AdminThreads />} />
                <Route path='/admin/:forumId/:threadId/' element={<PostProvider>
                    <AdminComments />
                  </PostProvider>} />
                <Route path='/admin/users' element={<AdminUsers />} /> 
                <Route path='/admin/users/:userId' element={<AdminUsers />} /> 
                <Route path='/admin/reports' element={<AdminReports />} /> 
              </Route> 
            </Route>
          </Route>

          {/* Missing  and Unauthorized*/}
          <Route path="/unauthorized" element={<Unauthorized />}/>
          <Route path="*" element={<Missing />}/>
        </Route> 
  )
)


const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
