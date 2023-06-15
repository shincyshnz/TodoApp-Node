import React, { useState } from "react";
import "./TodoList.css";

export const TodoList = ({ todo, toggleIsCompleted }) => {
  const { _id, task, isCompleted } = todo;
  const classNameText = `list-item ${isCompleted ? "list-completed" : ""}`;

  return (
    <p
      className={classNameText}
      key={_id}
      onClick={(event) => toggleIsCompleted(event, todo)}
    >
      {task}
    </p>
  );
};
