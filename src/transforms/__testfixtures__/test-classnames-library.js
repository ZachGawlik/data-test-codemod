import React from 'react';
import classNames from 'classnames';

const cx = classNames.bind({ active: 'btn-active' });

const Form = () => (
  <div>
    <div className="untested-components">
      <input className={classNames('text-input', { disabled: true })} />
      <input className={cx('text-input', ['active'], { disabled: true })} />
    </div>
    <div className="tested-components">
      <input className={classNames('test-classnames-input')} />
      <button className={classNames('test-classnames-btn', { disabled: true })}>
        Test classNames parsing
      </button>
      <button className={cx('test-cx-btn', ['active'], { 'btn-hover': false })}>
        Test cx parsing
      </button>
    </div>
  </div>
);

export default ButtonGroup;
