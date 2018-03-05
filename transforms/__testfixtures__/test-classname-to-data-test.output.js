import React from 'react';

const ButtonGroup = ({ editItem }) => (
  <div>
    <button data-test="add-btn">Add</button>
    <button className="btn btn-secondary" onClick={editItem} data-test="edit-btn">
      Edit
    </button>
    <button className="btn btn-danger" data-test="delete-btn">
      Delete
    </button>
  </div>
);

export default ButtonGroup;
