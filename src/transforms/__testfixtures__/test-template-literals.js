import React from 'react';
import classNames from 'classnames';

const cx = classNames.bind({ active: 'btn-active' });

const Form = () => (
  <div>
    <div className="untested-components">
      <input className={`text-input disabled`} />
      <input className={`text-input ${active ? 'active' : 'inactive'}`} />
    </div>
    <div className="tested-components">
      <input className={`test-template-input`} />
      <button className={`test-template-btn btn ${disabled && 'disabled'}`}>
        Test classNames parsing
      </button>
    </div>
  </div>
);

export default ButtonGroup;
