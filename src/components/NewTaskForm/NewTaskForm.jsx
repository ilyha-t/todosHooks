import React, { useState } from "react";

function NewTaskForm({ config, addTodo }) {
    const [label, setLabel] = useState('');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    function onSubmitForm() {
      const newLabel = label;
      if (newLabel.trim().length > 0) {
        addTodo({ text: newLabel, timer: {value: minutes * 60 + seconds, isActive: true, timerId: null} });
      }
      setLabel('');
      setMinutes(0);
      setSeconds(0);
    };

    function translateIntoMinutes(sec) {
      if(sec >= 60) {
        const calcMin = Math.floor(sec / 60);
        const calcSec = sec % 60;
        setMinutes(minutes + calcMin);
        setSeconds(calcSec);
      } else {
        setSeconds(sec);
      }
    }

    return (
      <header className="header">
        <h1>{config.appName}</h1>
        <form className="new-todo-form" onKeyDown={e => e.keyCode === 13 && onSubmitForm()}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onChange={(e) => setLabel(e.target.value)}
            value={label}
          />
          <input
            type="number"
            className="new-todo-form__timer"
            placeholder="Min"
            onChange={(e) => setMinutes(minutes + Number(e.target.value))}
            value={minutes > 0 ? minutes : ''}
            onKeyPress={(e) => {
              if (isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="number"
            className="new-todo-form__timer"
            placeholder="Sec"
            onChange={(e) => translateIntoMinutes(Number(e.target.value))}
            value={seconds > 0 ? seconds : ''}
            onKeyPress={(e) => {
              if (isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
          />
        </form>
      </header>
    );
}

export default NewTaskForm;