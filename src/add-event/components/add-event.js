import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./add-event.css";

class AddEventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.showModal || false,
      toggleModal: this.props.toggleModal,
      eventToEdit: this.props.eventToEdit,
      handleFormSubmit: this.props.handleFormSubmit
    };
  }
  submitForm = e => {
    e.preventDefault();
    const { date, id, title, description, time } = this.state.eventToEdit;
    this.state.handleFormSubmit({
      id,
      title,
      description,
      date,
      time
    });
  };

  setTitle = t => {
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        title: t
      }
    }));
  };

  setDescription = d => {
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        description: d
      }
    }));
  };

  setTime = t => {
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        time: t
      }
    }));
  };

  render() {
    const { title, description, time } = this.state.eventToEdit;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.showModal}
          onClose={this.state.toggleModal}
        >
          <div className="paper add-event-modal">
            <center>
              <h2 id="simple-modal-title">Edit Event Data</h2>
            </center>
            <form onSubmit={this.submitForm}>
              <div>
                <TextField
                  required
                  id={title}
                  label="Event Title"
                  defaultValue={title}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={e => this.setTitle(e.target.value)}
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
                  onChange={e => this.setDescription(e.target.value)}
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
                  onChange={e => this.setTime(e.target.value)}
                />
              </div>
              <div className="event-button">
                <center>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.submitForm}
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
}

export default AddEventModal;