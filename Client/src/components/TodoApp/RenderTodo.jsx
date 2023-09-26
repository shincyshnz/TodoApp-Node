import React, { useState } from "react";
import { TodoList } from "./TodoList/TodoList";
import { Buttons } from "./Buttons/Buttons";
import { Input } from "./Input/Input";
import axios from "axios";

const RenderTodo = ({
  todos,
  setTodos,
  todo,
  toggleIsCompleted,
  inputValue,
  setInputValue,
  setErrorInputField,
  errorInputField,
  onClickEventDelete,
  API_URL,
}) => {
  const [editInputObj, setEditInputObj] = useState({});

  const onClickEventCancel = (event) => {
    event.preventDefault();
    setErrorInputField((prev) => ({
      ...prev,
      editInput: {
        errorMessage: "",
      },
      addInput: {
        errorMessage: "",
      },
    }));
    setEditInputObj({});
  };

  const onClickEventSave = async (event) => {
    event.preventDefault();
    if (errorInputField?.editInput?.errorMessage) return;

    try {
      const response = await axios(API_URL, {
        method: "PUT",
        data: {
          _id: editInputObj._id,
          task: inputValue.editInput,
          isCompleted: editInputObj.isCompleted,
        },
      });

      // Update todos with updated Data from Database
      const tempTodos = todos.map((todo) => {
        if (todo._id === response.data._id) {
          todo = response.data;
        }
        return todo;
      });
      setTodos(tempTodos);
      setEditInputObj({});
      toast.info("Task Updated successfully");
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        editInput: {
          errorMessage: err.response?.data.message,
        },
      }));
    }
  };

  const onClickEventEdit = (event, todoId) => {
    event.preventDefault();

    const found = todos.find((todo) => todo._id === todoId);
    setInputValue((prev) => ({
      ...prev,
      editInput: found.task,
    }));

    setEditInputObj((prev) => (prev = found));
  };

  return (
    <>
      <div className="todo-list-container">
        <div className="list-container">
          <TodoList todo={todo} toggleIsCompleted={toggleIsCompleted} />
        </div>
        <div className="button-container">
          <Buttons
            classNameText={"edit-button"}
            onClickEvent={onClickEventEdit}
            buttonText={""}
            todoid={todo._id}
          />
          <Buttons
            classNameText={"delete-button"}
            onClickEvent={onClickEventDelete}
            buttonText={""}
            todoid={todo._id}
          />
        </div>
      </div>

      {editInputObj?._id && (
        <div className="edit-todo-container">
          <Input
            type={"text"}
            className={"edit-input"}
            name={"editInput"}
            placeholderText={editInputObj.task}
            inputValue={inputValue.editInput}
            setInputValue={setInputValue}
            setErrorInputField={setErrorInputField}
          />
          <div className="buttons">
            <Buttons
              classNameText={"add-button"}
              onClickEvent={onClickEventSave}
              buttonText={"SAVE"}
              todoid={editInputObj._id}
            />
            <Buttons
              classNameText={"cancel-button"}
              onClickEvent={onClickEventCancel}
              buttonText={"CANCEL"}
              todoid={editInputObj._id}
            />
          </div>
        </div>
      )}

      {editInputObj?._id && errorInputField.editInput.errorMessage && (
        <div className="error-container">
          <label className="error-input">
            {errorInputField.editInput.errorMessage}
          </label>
        </div>
      )}
    </>
  );
};

export default RenderTodo;
