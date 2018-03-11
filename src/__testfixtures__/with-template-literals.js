import React from 'react';

const Form = () => (
  <div>
    <div className="untested-components">
      <input className={`text-input disabled`} />
      <input className={`text-input ${active ? 'active' : 'inactive'}`} />
    </div>
    <div className="tested-components">
      <input className={`test-template-input`} />
      <button className={`btn ${disabled && 'disabled'} test-template-btn`}>
        Test classNames parsing
      </button>
    </div>
  </div>
);

export default ButtonGroup;
