import React, { useEffect, useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { func } from "prop-types";

function TodoItem({ props, config, doneTodo, deleteTodo, editTodo, pauseTimer, startTimer }) {
  const inputRef = React.createRef();

  const [todo, setTodo] = useState({
    edit: false,
    updatePeriod: '',
  });

  useEffect(() => {
    setTodo({...todo, updatePeriod: formatDistanceToNow(props.created)});
    const idUpdateF = updateInterval();
    return () => clearInterval(idUpdateF);
  }, [])



  function updateInterval() {
    const updateF = setInterval(() => {
      setTodo({...todo, updatePeriod: formatDistanceToNow(props.created)});
    }, config.updateIntervalCreated);
    return updateF;
  }

  function activateEditMode() {
      if (!props.done) {
        setTodo(() => {
          return { ...todo, edit: !todo.edit };
        });
        inputRef.current.focus();
      }
  };

  function cancelEdit(code)  {
    if (code === 27) {
      setTodo(() => {
        return { ...todo, edit: false };
      });
    }
  };

  function calcTimer(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes <= 9 ? '0' : ''}${minutes}:${seconds <= 9 ? '0' : ''}${seconds}`;
  }

    return (
      <li className={(props.done ? 'completed' : undefined) || (todo.edit ? 'editing' : undefined)}>
        <div className="view">
          <form>
            <input
              className="toggle"
              type="checkbox"
              checked={props.done}
              onChange={() => doneTodo(props)}
              id={props.id}
            />
            <label htmlFor={props.id}>
              <span className="title">{props.description}</span>
              <span className="description" onClick={e => e.preventDefault()}>
                  <button className="icon icon-play" onClick={() => startTimer(props)}></button>
                  <button className="icon icon-pause" onClick={() => pauseTimer(props)}></button>
                {calcTimer(props.timer.value)}
              </span>
              <span className="created">{todo.updatePeriod}</span>
            </label>
          </form>
          <button className="icon icon-edit" onClick={activateEditMode}></button>
          <button className="icon icon-destroy" onClick={() => deleteTodo(props)}></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTodo(() => {
              return { ...todo, edit: !todo.edit };
            });
          }}
        >
          <input
            className="edit"
            onChange={(e) => {
              editTodo(props, e.target.value);
            }}
            onKeyDown={(e) => cancelEdit(e.keyCode)}
            value={props.description}
            ref={inputRef}
          />
        </form>
      </li>
    );
}

export default TodoItem;