import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import React, { useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  overflowX: 'hidden'
};

const CreateInstructor = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box>
        <Button variant='contained' onClick={handleOpen}>Add Instructor</Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Instructor
            </Typography>
          </Box>
          <Box sx={{
            maxHeight: '60vh',
          }}>

          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CreateInstructor
