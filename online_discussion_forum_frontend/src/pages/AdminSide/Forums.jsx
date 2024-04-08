import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Box, Button, Card, CardContent, Grid, Typography, Stack } from '@mui/material';

import CreateForum from '../../modals/CreateForum';

const Forums = () => {
  const [forums, setForums] = useState();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleForumClick = (forumId) => {
    navigate(`/admin/${forumId}/threads`)
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getForums = async () => {
      try {
        const response = await axiosPrivate.get('/forums', {
          signal: controller.signal
        });
        const forumData = response.data.forums.map(forum => ({
          _id: forum._id,
          forumName: forum.name,
          creator: forum.creator,
          creatorId: forum.user,
          description: forum.description,
          creationTime: new Date(forum.creationTime).toLocaleDateString(),
          threads: forum.threads
        }));
        console.log(forumData)
        isMounted && setForums(forumData);
      } catch (err) {
        console.log(err)
        navigate('/admin/login', { state: { from: location }, replace: true });
      }
    }

    getForums();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, []);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
    >
      <Stack direction={'row'} justifyContent={'space-between'} sx={{
        marginRight: '50px',
        marginBottom: '20px'
      }}>
        <Typography variant="h5" sx={{
          fontWeight: '700',
          fontSize: '30px',
        }}>Forums List</Typography>
        <CreateForum />
      </Stack>

      {forums?.length ? (
        <Grid container spacing={2} direction={'column'} width={'70dvw'}>
          {forums.map((forum) => (
            <Grid item key={forum._id}>
              <Card sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                <CardContent onClick={() => handleForumClick(forum._id)} style={{ cursor: 'pointer' }}>
                  <Typography variant="h5">{forum.forumName}</Typography>
                  <Typography>{forum.description}</Typography>
                  <div onClick={(e) => e.stopPropagation()}>
                    <NavLink style={{ textDecoration: 'underline' }} to={`/admin/${forum.creatorId}`}>{forum.creator}</NavLink>
                  </div>
                  <Typography>{forum.creationTime}</Typography>
                  <Typography>Total Threads: {forum.threads.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No forums found</Typography>
      )}

    </Box>
  )
}

export default Forums
