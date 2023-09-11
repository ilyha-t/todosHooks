import React from 'react';

import FilterItem from '../FilterItem/FilterItem';

const TasksFilter = ({ filters = ['All'], filter, changeFilterTodo }) => {
  return (
    <ul className="filters">
      {filters.map((filterItem) => (
        <FilterItem key={filterItem} filter={filterItem} changeFilterTodo={changeFilterTodo} currentFilter={filter} />
      ))}
    </ul>
  );
};

export default TasksFilter;
