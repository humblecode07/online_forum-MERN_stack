import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import CreateComments from '../../modals/CreateComments';
import { usePost } from '../../context/PostContext';
import { CommentList } from '../../components/commentList';


const Comments = () => {
  const { post, rootComments } = usePost()

  const thread = post.thread

  if (!post) {
    return <div>Loading...</div>; // Render a loading indicator while data is being fetched
  }



  // const [comments, setComments] = useState([]);
  // const [threads, setThreads] = useState([]);
  // const axiosPrivate = useAxiosPrivate();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const { forumId, threadId } = useParams();


  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();

  //   const getComments = async () => {
  //     try {
  //       const response = await axiosPrivate.get(`/forums/${forumId}/threads/${threadId}/comments`, {
  //         signal: controller.signal
  //       });
  //       console.log("res data", response.data)
  //       const commentData = response.data.comments.map(comment => ({
  //         _id: comment._id,
  //         user: comment.user,
  //         username: comment.username,
  //         forumPost: comment.forumPost,
  //         threadPost: comment.threadPost,
  //         content: comment.content,
  //       }));

  //       console.log(commentData);
  //       isMounted && setComments(commentData);
  //     } catch (err) {
  //       console.log(err);
  //       navigate('/admin/login', { state: { from: location }, replace: true });
  //     }
  //   }

  //   getComments();

  //   return () => {
  //     isMounted = false;
  //     controller.abort();
  //   }
  // }, [axiosPrivate, forumId, navigate, location]);

  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();

  //   const getThreads = async () => {
  //     try {
  //       const response = await axiosPrivate.get(`/forums/${forumId}/threads`, {
  //         signal: controller.signal
  //       });
  //       console.log(response.data)
  //       const threadData = response.data.thread.map(thread => ({
  //         userId: thread.user,
  //         username: thread.username,
  //         forumPost: thread.forumPost,
  //         title: thread.title,
  //         content: thread.content,
  //         image: thread.image,
  //         upvotes: thread.upvotes,
  //         downvotes: thread.downvotes,
  //         viewCount: thread.viewCount,
  //         commentCount: thread.commentCount,
  //         edited: thread.edited,
  //         pinned: thread.pinned,
  //         timestamp: new Date(thread.timestamp).toLocaleDateString(),
  //         _id: thread._id,
  //       }));
  //       console.log(threadData);
  //       isMounted && setThreads(threadData);
  //     } catch (err) {
  //       console.log(err);
  //       navigate('/admin/login', { state: { from: location }, replace: true });
  //     }
  //   }

  //   getThreads();

  //   return () => {
  //     isMounted = false;
  //     controller.abort();
  //   }
  // }, [axiosPrivate, forumId, navigate, location]);

  return (
    <Box>
      {rootComments != null && rootComments.length > 0 && (
        <Box>
          <CommentList comments={rootComments} />
        </Box>
      )}
    </Box>

  );
}

export default Comments
