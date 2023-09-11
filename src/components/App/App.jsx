import React, { useEffect, useState } from "react";

import TodoList from '../TodoList/TodoList';
import Footer from '../Footer/Footer';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import config from '../../config/configUI';

function App() {
  const [data, setData] = useState({
    todos: [],
    filter: 'All',
  });

  useEffect(() => {
    const scheduleTodo = data.todos.filter(todo => todo.timer.timerId === null && todo.timer.isActive);


    for(let todo of scheduleTodo) {
      if(todo.timer.timerId === null && todo.timer.isActive) {
        let todoOld = todo;
        const interval = setInterval(() => {
            if (todoOld.timer.value !== 0 && !todoOld.done) {
              todoOld = {...todoOld, timer: {...todoOld.timer, value: todoOld.timer.value - 1, isActive: true, timerId: interval}};
              changeTimer(todoOld);
            } else {
              clearInterval(interval);
              todoOld = {...todoOld, timer: {...todoOld.timer, isActive: false, timerId: -1}};
              changeTimer(todoOld);
            }

        }, 1000);
      }
    }
  }, [data.todos, data.filter]);


  function addTodo(todo) {
      setData(prevData => {
        return {
          ...prevData,
          todos: [
            ...prevData.todos,
            {
              id: Date.now(),
              description: todo.text,
              done: false,
              important: false,
              created: new Date(),
              timer: { ...todo.timer, timerId: null }
            },
          ]
        }});
  };

  function doneTodo(todo) {
      if(todo.timer.isPlay) {
        clearInterval(todo.timer.timerId);
      }

      const findIndex = data.todos.findIndex((f) => f.id === todo.id);
      setData(() => {
        return {
          ...data,
          todos: [
            ...data.todos.slice(0, findIndex),
            { ...todo, done: !todo.done, timer: {...todo.timer, value: 0, isPlay: false} },
            ...data.todos.slice(findIndex + 1),
          ],
        };
      });
  };

  function changeTimer(todo) {
    setData((prevData) => {
      const findIndex = prevData.todos.findIndex((f) => f.id === todo.id);
      return {
        ...prevData,
        todos: [
          ...prevData.todos.slice(0, findIndex),
          { ...todo },
          ...prevData.todos.slice(findIndex + 1),
        ],
      };
    });

  };

  function pauseTimer(todo) {
    if(!todo.timer.isActive) {
      return;
    }

    clearInterval(todo.timer.timerId);
    changeTimer({ ...todo, timer: {...todo.timer, isActive: false, timerId: null} });
  };

  function startTimer(todo) {
    if (todo.timer.isActive) {
      return;
    }

    changeTimer({ ...todo, timer: {...todo.timer, isActive: true} });
  };

  function deleteTodo(todo) {
    if (todo.timer.isActive) {
      clearInterval(todo.timer.timerId);
    }

      setData((prevData) => {
        return {
          ...prevData,
          todos: data.todos.filter((taskId) => taskId.id !== todo.id),
        };
      });
  };

  function filterTodo(filterName) {
    switch (filterName) {
      case 'Active':
        return data.todos.filter((todo) => !todo.done);
      case 'Completed':
        return data.todos.filter((todo) => todo.done);
      default:
        return data.todos;
    }
  };

  function changeFilterTodo(element) {
      setData(prevData => {
        return {...prevData, filter: element.target.textContent };
      });
  };

  function clearCompleted() {
      setData(() => {
        return {
          ...data,
          todos: data.todos.filter((todo) => !todo.done),
        };
      });
  };

  function editTodo(todo, value) {
      const findIndex = data.todos.findIndex((f) => f.id === todo.id);
      setData(() => {
        return {
          ...data,
          todos: [
            ...data.todos.slice(0, findIndex),
            { ...todo, description: value },
            ...data.todos.slice(findIndex + 1),
          ],
        };
      });
  };

    return (
      <section className="todoapp">
        <NewTaskForm addTodo={addTodo} config={config} />
        <TodoList
          todos={filterTodo(data.filter)}
          doneTodo={doneTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          config={config}
          pauseTimer={pauseTimer}
          startTimer={startTimer}
        />
        <Footer
          todoCount={data.todos.filter((todo) => !todo.done).length}
          filter={data.filter}
          changeFilterTodo={changeFilterTodo}
          filters={config.filters}
          clearCompleted={clearCompleted}
        />
      </section>
    );
}

export default App;