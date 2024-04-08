import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { useParams } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateComments = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const axiosPrivate = useAxiosPrivate();
    const [comment, setComment] = useState(""); 
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };


    const { forumId, threadId } = useParams();

    const postComment = async () => { // Changed from postThread to postComment
        const formData = new FormData();

        formData.append('content', comment); // Changed from content to comment

        selectedFiles.forEach((file) => {
            formData.append('image', file);
        });

        try {
            const response = await axiosPrivate.post(`/forums/${forumId}/threads/${threadId}/comments`, formData, { // Added threadId to the endpoint
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data); // log the response if needed
            handleClose(); // close the modal after successful submission
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    };

    return (
        <>
            <Box>
                <Button variant='contained' onClick={handleOpen}>Create Comment</Button> {/* Changed from "Create Thread" to "Create Comment" */}
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Comment
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div>
                        <input type="file" multiple onChange={handleFileChange} />
                    </div>
                    <Button onClick={postComment} variant='contained'>Submit</Button> {/* Changed from postThread to postComment */}
                </Box>
            </Modal>
        </>
    );
};

export default CreateComments;
