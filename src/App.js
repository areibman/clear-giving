import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";
import { listNotes } from "./graphql/queries";
// import { Link } from "react-router";
import { createNote, updateNote, deleteNote } from "./graphql/mutations";
// import { Link } from "aws-amplify-react/dist/AmplifyUI";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";
import ProgressBar from "react-bootstrap/ProgressBar";
// import { Button } from "aws-amplify-react/dist/AmplifyUI";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { LineChart, PieChart, ColumnChart } from "react-chartkick";
import "chart.js";
import SimpleModal from "./simplemodal";
Amplify.configure(aws_exports);

const App = () => {
  const [notes, setNotes] = useState([]);
  const [name, setNote] = useState("");
  const [noteId, setNoteId] = useState("");
  const [noteIndex, setNoteIndex] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    handleListNotes();
  }, []);

  const handleListNotes = async () => {
    const { data } = await API.graphql(graphqlOperation(listNotes));
    console.log(data);
    setNotes(data.listNotes.items);
  };

  const hasExistingNote = () => {
    if (noteId) {
      const isNote = notes.findIndex(name => name.id === noteId) > -1;
      return isNote;
    }
    return false;
  };

  const hasNote = () => {
    if (name.trim()) {
      return true;
    }
    return false;
  };

  const handleUpdateNote = async () => {
    const payload = { id: noteId, name };
    const { data } = await API.graphql(
      graphqlOperation(updateNote, { input: payload })
    );
    const updatedNote = data.updateNote;
    const updatedNotes = [
      ...notes.slice(0, noteIndex),
      updatedNote,
      ...notes.slice(noteIndex + 1)
    ];
    setNotes(updatedNotes);
    setNote("");
    setNoteId("");
  };

  const handleDelete = async id => {
    setDeletingId(id);
    const payload = { id };
    const { data } = await API.graphql(
      graphqlOperation(deleteNote, { input: payload })
    );
    const deletedNoteId = data.deleteNote.id;
    const deletedNoteIndex = notes.findIndex(name => name.id === deletedNoteId);
    const updatedNotes = [
      ...notes.slice(0, deletedNoteIndex),
      ...notes.slice(deletedNoteIndex + 1)
    ];
    setNotes(updatedNotes);
    setDeletingId("");
  };

  const handleAddNote = async event => {
    event.preventDefault();

    if (hasExistingNote()) {
      handleUpdateNote();
    } else if (hasNote()) {
      const payload = { name };
      const { data } = await API.graphql(
        graphqlOperation(createNote, { input: payload })
      );
      const newNote = data.createNote;
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setNote("");
    }
  };

  const handleSetNote = ({ name, id }, index) => {
    setNote(name);
    setNoteId(id);
    setNoteIndex(index);
  };

  const newLocal = 45;
  return (
    <Router>
      <img src={require("./logo.png")} />
      <div className="flex flex-column items-center justify-center bg-washed-green pa3 f1">
        <Route
          path="/"
          exact
          render={() => {
            return (
              <div>
                <h2 className={"f1 flex flex-column items-center"}>
                  Your Active Funding Efforts
                </h2>

                <div className="flex flex-column items-center justify-center bg-washed-yellow pa3 f1">
                  <h1 className="f2">Maria Lopez Limbic Surgery Fund</h1>
                  <h4>Funding goals:</h4>
                  <h6>
                    <p>
                      6 year old Maria has suffered severe cranial lessions and
                      requires neurosurgery
                    </p>
                  </h6>
                  <h6>Reach $8,500 within 3 months</h6>
                  <h6>Your contribution: $200</h6>
                  <h5>
                    <li>Monthly Targets:</li>
                    <ProgressBar
                      now={100}
                      variant="success pad"
                      label={"April"}
                    />
                    <ProgressBar now={80} variant="warning" label={"May"} />
                    <ProgressBar now={0} variant="warning" label={"June"} />
                  </h5>
                  <div>
                    {notes.map((item, i) => (
                      <div key={item.id} className="flex items-center">
                        <li
                          className="list pa1 f3"
                          style={{ color: deletingId === item.id && "red" }}
                          onClick={() => handleSetNote(item, i)}
                        >
                          {item.name}
                        </li>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-transparent bn f4"
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/fundraiser">
                    <Button variant="contained" color="primary">
                      Learn More
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-column justify-center">
                  <ProgressBar
                    animated
                    now={70}
                    variant="danger"
                    label={"70%"}
                  />
                  {/* space */}
                  <br />

                  <div className="flex flex-column items-center justify-center bg-washed-yellow pa3 f1">
                    <h1 className="f2">Freddy Phish Medication</h1>
                    <h4>Funding goals:</h4>
                    <h6>
                      <p>11 year old freddy needs more Theraxadon</p>
                    </h6>
                    <h6>Reach $500 within 1 months</h6>
                    <h6>Your contribution: $10</h6>
                    <h5>
                      <li>Monthly Targets:</li>
                      <ProgressBar now={45} variant="info" label={"June"} />
                    </h5>
                    <div>
                      {notes.map((item, i) => (
                        <div key={item.id} className="flex items-center">
                          <li
                            className="list pa1 f3"
                            style={{ color: deletingId === item.id && "red" }}
                            onClick={() => handleSetNote(item, i)}
                          >
                            {item.name}
                          </li>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-transparent bn f4"
                          >
                            <span>&times;</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <Link to="/fundraiser">
                      <Button variant="contained" color="primary">
                        Learn More
                      </Button>{" "}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-column justify-center">
                  <ProgressBar animated now={45} label={"45%"} />
                </div>

                {/* space */}
                <br />
                <div className="flex flex-column items-center justify-center bg-washed-yellow pa3 f1">
                  <h1 className="f2">Sarah Lee Prosthetic Replacment</h1>
                  <h4>Funding goals:</h4>
                  <h6>
                    <p>
                      12 year old Sarah needs a new prosthetic leg since she is
                      growing
                    </p>
                  </h6>
                  <h6>Reach $400 within 3 months</h6>
                  <h6>Your contribution: $0</h6>

                  <div>
                    {notes.map((item, i) => (
                      <div key={item.id} className="flex items-center">
                        <li
                          className="list pa1 f3"
                          style={{ color: deletingId === item.id && "red" }}
                          onClick={() => handleSetNote(item, i)}
                        >
                          {item.name}
                        </li>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-transparent bn f4"
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/fundraiser">
                    <Button variant="contained" color="primary">
                      Learn More
                    </Button>{" "}
                  </Link>
                </div>
                <div className="flex flex-column justify-center">
                  <ProgressBar
                    animated
                    now={100}
                    variant={"success"}
                    label={"100%"}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* HEREHREHREHRHWEHRHWERHWEHRHWEHRWEHRHEWHRW */}
      <Route
        path="/fundraiser"
        render={() => {
          return (
            <div>
              <div className="w-90 flex flex-column items-center justify-center pa3 f1 ">
                {" "}
                <h2 className={"f1"}>
                  Maria Lopez Limbic Surgery Fund Account
                </h2>
                <ColumnChart
                  data={{
                    "4-1-19": 24,
                    "4-4-19": 23,
                    "4-7-19": 10,
                    "4-10-19": 8,
                    "4-13-19": 17,
                    "4-16-19": 16,
                    "4-19-19": 40,
                    "4-22-19": 34,
                    "4-25-19": 48,
                    "4-28-19": 29,
                    "5-1-19": 36,
                    "5-4-19": 18,
                    "5-7-19": 10,
                    "5-10-19": 30,
                    "5-13-19": 30,
                    "5-16-19": 14,
                    "5-19-19": 22,
                    "5-22-19": 24,
                    "5-25-19": 32,
                    "5-28-19": 49
                  }}
                />
                <div className="flex">
                  <h3>Expenditures</h3>
                  <PieChart
                    data={[
                      ["Administration", 24],
                      ["SG&A", 6],
                      ["Medical Equipment Purchase", 70]
                    ]}
                  />
                  <h3>Revenue</h3>
                  <PieChart
                    data={[
                      ["Carl Icahn", 65],
                      ["Jerry Seinfeld", 15],
                      ["Warren Buffet", 10],
                      ["Anonymous Donors", 5],
                      ["other", 5]
                    ]}
                  />
                  <div className="w-90  flex-column items-left justify-center pa3 f1 ">
                    <h3 className="flex-column justify-center">Donate</h3>
                    <div className="flex">
                      {" "}
                      <Button variant="contained" color="primary">
                        $5
                      </Button>
                      <Button variant="contained" color="primary">
                        $10
                      </Button>
                      <Button variant="contained" color="primary">
                        $25
                      </Button>
                      <Button variant="contained" color="primary">
                        $100
                      </Button>
                    </div>
                    <Button variant="contained" color="primary">
                      Custom Amount
                    </Button>

                    <br />
                    <img src={require("./citi.jpg")} />
                    {/*
                    <Button variant="contained" color="primary">
                      Donate Points with Citi™
                    </Button> */}
                    <SimpleModal />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </Router>
  );
};

export default withAuthenticator(App, { includeGreetings: true });
