import { Stack, Avatar, TextField, InputAdornment, Box, IconButton, Tooltip, MenuItem, Divider, ListItemIcon, Menu } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import useLogout from '../hooks/useLogout';

const NavBar = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const logout = useLogout();

	const [userData, setUserData] = useState(null);

	const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleStudentClick = (studentId, settings) => {
		if (decoded.roles.includes('Admin')) {
			if (!window.location.pathname.startsWith('/client')) {
				// If the current path does not start with '/client', navigate to the admin page
				navigate(`/admin/student/${studentId}/${settings ? 'settings' : ''}`);
			}
			else {
				navigate(`/client/student/${studentId}/${settings ? 'settings' : ''}`);
			}
		} else if (decoded.roles.includes('Instructor')) {
			navigate(`/instructor/${studentId}/${settings ? 'settings' : ''}`);
		} else if (decoded.roles.includes('Student')) {
			console.log('reached');
			navigate(`/client/student/${studentId}/${settings ? 'settings' : ''}`);
		}
	};

	const getUser = async () => {
		try {
			const response = await axiosPrivate.get(`/users/${decoded.userId}/`, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			})
			const fetchedUserData = response.data;
			setUserData(fetchedUserData);
		}
		catch (err) {
			console.error('Error fetching user data:', err);
		}
	}

	useEffect(() => {
		if (decoded?.userId) {
			getUser();
		}
	}, [decoded?.userId]);

	return (
		<Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} sx={{
			marginTop: '20px',
			marginBottom: '20px'
		}}>
			<TextField id="search-bar" label="Search" variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon />
						</InputAdornment>
					), sx: { borderRadius: '25px', height: '50px' }
				}}
				sx={{
					'& .MuiFormLabel-root': {
						fontSize: '0.9rem',
					},
					width: '50dvh',
					marginRight: '25dvw'
				}} />
			<Stack direction={'row'}>
				<IconButton aria-label="dark-mode">
					<DarkModeIcon />
				</IconButton>
			</Stack>
			<Tooltip title="Account settings">
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<Avatar sx={{
						cursor: 'pointer'
					}}>
						{userData && userData.user && userData.user.length > 0 && (
							<img src={`http://localhost:3000/${userData.user[0].profile}`} alt="Firefly" />
						)}
					</Avatar>
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&::before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={() => {
					handleClose();
					handleStudentClick(decoded.userId, false)
				}}>
					<ListItemIcon>
						<AccountCircleIcon />
					</ListItemIcon>
					Profile
				</MenuItem>
				<Divider />
				<MenuItem onClick={() =>{
					handleClose();
					handleStudentClick(decoded.userId, true)
				}}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem onClick={() => {
					handleClose();
					logout();
				}}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>

		</Box>
	)
}

export default NavBar
