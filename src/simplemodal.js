import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

var request = require("request");

var options = {
  method: "GET",
  url:
    "https://sandbox.apihub.citi.com/gcb/api/v1/rewards/pointBalance?cloakedCreditCardNumber=c88b3dbf7f7546c90523fe046ae5aa8639fb2dab2d8e5f4c3cc9351f99ef963086bf854bcaa6924a524a18a6c90817fc21b192c3694180a0a99ae8c1f5e68da0&merchantCode=FLOWR&rewardProgram=THANKU&rewardLinkCode=998OB390B502W4G4PQIMGP8P4155378GM4SQ3ORF418134ST",
  qs: {
    rewardProgram: "THANKU",
    merchantCode: "FLOWR"
  },
  headers: {
    accept: "application/json",
    "accept-language": "en-us",
    authorization:
      "Bearer AAIkMzkwNmRkNmQtNTM0Yi00ZDIwLTgxZDctMGU3ODg0ODAxM2Ezu8DvegkVA03UYQPwMUeKuObPInv58V7eNt236DQqO4UtU7IotDjhEqEvtU3CpbjDFi6cjVEd6d-xHN3BxZg-IiK5ksUvhX4gS-O5o3_VeBZABtFrQubi9qAek6LlMOjoRVskdvAIn9AcIekuN0eT25mW9lW1A3AaOjjhSkca2r4k-nh0e3mUht_S1Y_q8QHIZFM7-WDdDe1AYSzR2NLcPg",
    businesscode: "GCB",
    countrycode: "US",
    "content-type": "application/json",
    uuid: "2a6eaa4c-8ad5-4138-3a26-45862ebf505d",
    client_id: "3906dd6d-534b-4d20-81d7-0e78848013a3"
  }
};

// request(options, function(error, response, body) {
//   if (error) return console.error("Failed: %s", error.message);

//   console.log("Success: ", body);
// });

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none"
  }
}));

function SimpleModal() {
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  function getPoints(event) {
    request(options, function(error, response, body) {
      if (error) return console.error("Failed: %s", error.message);
      alert("Your point balance is " + JSON.parse(body).availablePointBalance);
    });
    event.preventDefault();
  }
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Donate Points with Citi™
      </Button>
      {/* <Button onClick={handleOpen}>Open Modal</Button> */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <img src={require("./citi.jpg")} />

          <Typography variant="h6" id="modal-title">
            Please Authenticate your Citi™ account
            <form onSubmit={getPoints}>
              Username: <br />
              <input type="text" />
              <br />
              Balance Password: <br />
              <input type="text" /> <br />
              <input type="submit" value="Check Points" />
            </form>
            <Button variant="contained" color="primary">
              Accept and Purchase
            </Button>{" "}
          </Typography>
        </div>
      </Modal>
    </div>
  );
}

export default SimpleModal;
