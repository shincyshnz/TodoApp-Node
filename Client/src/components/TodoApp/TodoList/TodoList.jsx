import React, { useState } from "react";
import "./TodoList.css";

export const TodoList = ({ todo, toggleIsCompleted }) => {
  const { id, task, isCompleted } = todo;

  const classNameText = `list-item ${isCompleted ? "list-completed" : ""}`;

  return (
    <p
      className={classNameText}
      key={id}
      onClick={(event) => toggleIsCompleted(event, todo)}
    >
      {task}
    </p>
  );
};
