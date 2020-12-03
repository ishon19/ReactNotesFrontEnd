import React, { useState, useEffect, useRef } from "react";
import Note from "./Note";
import noteService from "../services/note";
import loginService from "../services/login";
import Notification from "./Notification";
import LoginForm from "./Login";
import Toggleable from "./Toggleable";
import NoteForm from "./NoteForm";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>Note App.. Courtesy of University of Helsinki 2020</em>
    </div>
  );
};

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note..");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  const hook = () => {
    console.log("effect");
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  };

  useEffect(hook, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedNoteappuser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(setErrorMessage(null), 3000);
    }
    console.log("Logging in with", username, password);
  };

  const addNote = (event) => {
    noteFormRef.current.toggleVisibility();
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      //id: notes.length + 1,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)))
      )
      .catch((error) => {
        setErrorMessage(
          `the note '${note.content}' has already been deleted from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const noteFormRef = useRef();

  const noteForm = () => (
    <Toggleable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Toggleable>
  );

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div className="header">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} Logged In</p>
          {noteForm()}
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "Important" : "All"}
        </button>
      </div>
      <ul>
        {notesToShow.map((element) => (
          <Note
            key={element.id}
            note={element}
            toggleImportance={() => toggleImportanceOf(element.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
