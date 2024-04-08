import { Stack, Avatar, TextField, InputAdornment, Box, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const NavBar = () => {
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
        </Box>
    )
}

export default NavBar
