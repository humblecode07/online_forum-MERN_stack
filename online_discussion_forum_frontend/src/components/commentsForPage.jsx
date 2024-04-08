import { usePost } from "../context/PostContext"
import { CommentList } from "./commentList";
import { Button, Card, CardContent, Grid, Typography, Stack, CardMedia } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';

export function Comment({ _id, content, upvotes, downvotes, image, edited, username, timestamp, replies }) {
    const { getReplies } = usePost();

    const date = new Date(timestamp).toLocaleDateString();

    console.log('commentsforpages', _id)
    const childComments = getReplies(_id)

    console.log('childComments', childComments)

    return (
        <Grid container spacing={2} direction={'column'} width={'70dvw'}>
            <Grid item key={_id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ border: '1px solid #ccc', borderRadius: '8px', height: 'auto', margin: '10px 0' }}>
                    <CardContent sx={{
                        width: '45dvw'
                    }}>
                        <Stack direction={'row'} spacing={2}>
                            <Typography>{username}</Typography>
                            <Typography>{date}</Typography>
                            <Typography>{edited === true ? 'edited' : ''}</Typography>
                        </Stack>
                        <Typography sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                        }}>{content}</Typography>
                        <Stack direction={'row'} spacing={2}>
                            <Button onClick={(e) => {
                                e.stopPropagation();
                            }} startIcon={<ThumbUpOffAltIcon />} sx={{
                                color: '#000000',
                                '&:hover': {
                                    bgcolor: 'transparent',
                                    color: '#1976d2'
                                }
                            }}><Typography>{upvotes}</Typography></Button> {/* Prevent navigation */}
                            <Button onClick={(e) => {
                                e.stopPropagation();
                            }} startIcon={<ThumbDownIcon />}><Typography>{downvotes}</Typography></Button> {/* Prevent navigation */}
                            <Button startIcon={<CommentIcon />}><Typography>{replies.length}</Typography></Button>
                        </Stack>
                        {image && image.map((img, index) => (
                            <Grid item key={index}>
                                <CardMedia
                                    component="img"
                                    style={{ borderRadius: '8px', height: 'auto', width: '100%', objectFit: 'cover' }}
                                    image={img ? `http://localhost:3000/${img}` : 'https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto'}
                                />
                            </Grid>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
            {/* {childComments?.length > 0 && (
            <>
                <CommentList comments={childComments} />
            </>
        )} */}
        </Grid>
    )
}