import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import React, { useState } from "react";
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

const CreateThreads = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const axiosPrivate = useAxiosPrivate();
    const [threadName, setThreadName] = useState("");
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const { forumId } = useParams();

    console.log("this is the forum id: " + forumId); 

    const postThread = async () => {
        const formData = new FormData();

        formData.append('title', threadName);
        formData.append('content', content);

        selectedFiles.forEach((file) => {
            formData.append('image', file);
        });

        try {
            const response = await axiosPrivate.post(`/forums/${forumId}/threads`, formData, {
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
                <Button variant='contained' onClick={handleOpen}>Create Thread</Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Thread
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="Thread Title"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={threadName}
                        onChange={(e) => setThreadName(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Content"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div>
                        <input type="file" multiple onChange={handleFileChange} />
                    </div>
                    <Button onClick={postThread} variant='contained'>Submit</Button>
                </Box>
            </Modal>
        </>
    );
};

export default CreateThreads;
