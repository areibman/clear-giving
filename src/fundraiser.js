import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";
import { listNotes } from "./graphql/queries";
import { link } from "react-router";
import { createNote, updateNote, deleteNote } from "./graphql/mutations";
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

  return (
    <div className="flex flex-column items-center justify-center bg-washed-red pa3 f1">
      <h1 className="f2">Amplify asdjlkfasdjklfljksfjlk</h1>

      {/* Note Form */}
      <form onSubmit={handleAddNote} className="mb3">
        <input
          className="pa2 f4"
          placeholder="Write your name"
          type="text"
          value={name}
          onChange={({ target }) => setNote(target.value)}
        />

        <button type="submit" className="pa2 f4">
          {noteId ? "Update" : "Add"}
        </button>
      </form>

      {/* Note List */}
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
    </div>
  );
};

export default withAuthenticator(App, { includeGreetings: true });
