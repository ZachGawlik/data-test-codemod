import React from 'react';

const ButtonGroup = ({ editItem }) => (
  <div>
    <button className="test-add-btn">Add</button>
    <button className="btn test-edit-btn btn-secondary" onClick={editItem}>
      Edit
    </button>
    <button className="btn btn-danger" data-test="delete-btn">
      Delete
    </button>
  </div>
);

export default ButtonGroup;
