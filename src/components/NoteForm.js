import React from "react";

const NoteForm = ({ onSubmit, handleChange, value }) => {
  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={onSubmit}>
        <input value={value} onChange={handleChange} />
        <button type="submit">Save Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
