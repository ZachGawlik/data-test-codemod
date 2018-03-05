import React from 'react';

const ButtonGroup = ({ editItem }) => (
  <div>
    <button className="spec-add-btn">Add</button>
    <button className="btn spec-edit-btn btn-secondary" onClick={editItem}>
      Edit
    </button>
    <button className="btn btn-danger" data-test="delete-btn">
      Delete
    </button>
  </div>
);

export default ButtonGroup;
