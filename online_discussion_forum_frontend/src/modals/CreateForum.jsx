import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import React, { useState } from "react";

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

const CreateForum = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const axiosPrivate = useAxiosPrivate();
    const [forumName, setForumName] = useState("");
    const [description, setDescription] = useState("");

    const postForum = async () => {
        try {
            const response = await axiosPrivate.post('/forums',
                JSON.stringify({
                    name: forumName,
                    description: description
                }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response.data); // log the response if needed
            handleClose(); // close the modal after successful submission
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    };

    return (
        <>
            <Box>
                <Button variant='contained' onClick={handleOpen}>Create Forum</Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Forum
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="Forum Name"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={forumName}
                        onChange={(e) => setForumName(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button onClick={postForum} variant='contained'>Submit</Button>
                </Box>
            </Modal>
        </>
    )
}

export default CreateForum
