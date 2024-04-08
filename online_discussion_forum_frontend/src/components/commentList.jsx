import { Comment } from "./commentsForPage"
import { Box } from '@mui/material';

export function CommentList({ comments }) {
    if (!comments || comments.length === 0) {
      return <div>No comments to display</div>; // Render a message if comments are undefined or empty
    }
  
    return (
      <>
        {comments.map(comment => (
          <Box key={comment._id}>
            <Comment {...comment} />
          </Box>
        ))}
      </>
    );
  }