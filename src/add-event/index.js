import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: `50%`,
    height: `50%`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  eventbutton: {
    margin: "5%"
  }
}));

export default function AddEventModal({
  showModal,
  toggleModal,
  handleFormSubmit,
  eventToEdit
}) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [title, setTitle] = useState(eventToEdit.title || "");
  const [description, setDescription] = useState(eventToEdit.description || "");
  const [time, setTime] = useState(eventToEdit.time || "");

  const submitForm = e => {
    e.preventDefault();
    const { id, date } = eventToEdit;
    handleFormSubmit({
      id,
      title,
      description,
      date,
      time
    });
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={showModal}
        onClose={toggleModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <h2 id="simple-modal-title">Edit Event Data</h2>
          </center>
          <form onSubmit={submitForm}>
            <div>
              <TextField
                required
                id={title}
                label="Event Title"
                defaultValue={title}
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <TextField
                required
                id={description}
                label="Event Description"
                defaultValue={description}
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div>
              <TextField
                required
                id={time}
                type="time"
                defaultValue="07:30"
                label="Event Time"
                defaultValue={time}
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 min
                }}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div className={classes.eventbutton}>
              <center>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  Save Event Data
                </Button>
              </center>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
