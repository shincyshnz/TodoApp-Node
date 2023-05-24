import React, { useEffect, useRef, useState } from "react";
import "./TodoApp.css";
import { Buttons } from "./Buttons/Buttons";
import { Input } from "./Input/Input";
import { TodoList } from "./TodoList/TodoList";
import { v4 as uuid } from "uuid";
import axios from "axios";

const API_URL = "http://localhost:3010/api/task";

export const TodoApp = () => {
  const inputRef = useRef(null);

  const [inputValue, setInputValue] = useState({
    addInput: "",
    editInput: "",
  });
  const [editInputObj, setEditInputObj] = useState({});
  const [errorInputField, setErrorInputField] = useState({
    addInput: {
      errorMessage: "",
    },
    editInput: {
      errorMessage: "",
    },
    apiError: {
      errorMessage: "",
    },
  });

  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios(API_URL);
      setTodos(response.data);
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Handling Button click Event for adding new todo
  const onClickEventAdd = async (event) => {
    event.preventDefault();
    if (errorInputField.addInput.errorMessage) {
      return;
    }

    try {
      const response = await axios(API_URL, {
        method: "POST",
        data: {
          task: inputValue.addInput,
        },
      });
      setTodos(response.data);
      setInputValue((prev) => ({
        ...prev,
        addInput: "",
      }));
    } catch (err) {
      console.log(err.response);
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  // Handling Button click Event for Deleting existing todo
  const onClickEventDelete = async (event, todoId) => {
    event.preventDefault();

    try {
      const response = await axios(API_URL, {
        method: "DELETE",
        data: {
          id: todoId,
        },
      });
      setTodos(response.data);
    } catch (err) {
      console.log(err.response);
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  // Handling Button click Event for Editing existing todo
  const onClickEventEdit = (event, todoId) => {
    event.preventDefault();

    const found = todos.find((todo) => todo.id === todoId);
    setInputValue((prev) => ({
      ...prev,
      editInput: found.task,
    }));

    setEditInputObj((prev) => (prev = found));
  };

  // Handling Button click Event for cancel Edit
  const onClickEventCancel = (event) => {
    event.preventDefault();

    setEditInputObj({});
  };

  // Handling Button click Event for cancel Edit
  const onClickEventSave = async (event) => {
    event.preventDefault();

    if (errorInputField.editInput.errorMessage) return;

    try {
      const response = await axios(API_URL, {
        method: "PUT",
        data: {
          id: editInputObj.id,
          task: inputValue.editInput,
          isCompleted: editInputObj.isCompleted,
        },
      });
      setTodos(response.data);
      setEditInputObj({});
    } catch (err) {
      console.log(err.response);
      setErrorInputField((prev) => ({
        ...prev,
        editInput: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  const toggleIsCompleted = async (event, todo) => {
    try {
      const response = await axios(API_URL, {
        method: "PUT",
        data: {
          id: todo.id,
          task: todo.task,
          isCompleted: !todo.isCompleted,
        },
      });
      setTodos(response.data);
    } catch (err) {
      console.log(err.response);
      setErrorInputField((prev) => ({
        ...prev,
        editInput: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  const renderTodoList = (todo, index) => {
    return (
      <div className="todo-list-container" key={index}>
        <div className="list-container">
          <TodoList todo={todo} toggleIsCompleted={toggleIsCompleted} />
        </div>
        <div className="button-container">
          <Buttons
            classNameText={"edit-button"}
            onClickEvent={onClickEventEdit}
            buttonText={""}
            todoid={todo.id}
          />
          <Buttons
            classNameText={"delete-button"}
            onClickEvent={onClickEventDelete}
            buttonText={""}
            todoid={todo.id}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-inner-container" ref={inputRef}>
        <h1>Todo List</h1>
        <div className="add-todo-container">
          <Input
            type={"text"}
            className={"add-input"}
            name={"addInput"}
            placeholderText={"New Todo"}
            setInputValue={setInputValue}
            setErrorInputField={setErrorInputField}
            inputValue={inputValue.addInput}
          />
          <Buttons
            classNameText={"add-button"}
            onClickEvent={onClickEventAdd}
            buttonText={"ADD TODO"}
            todoid={""}
          />
        </div>

        {
          <div className="error-container">
            {errorInputField.apiError.errorMessage && (
              <label className="error-input">
                {errorInputField.apiError.errorMessage}
              </label>
            )}
          </div>
        }

        {todos.length > 0 &&
          todos.map((todo, index) => {
            return renderTodoList(todo, index);
          })}

        {editInputObj.id && (
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
            <Buttons
              classNameText={"add-button"}
              onClickEvent={onClickEventSave}
              buttonText={"SAVE"}
              todoid={editInputObj.id}
            />
            <Buttons
              classNameText={"cancel-button"}
              onClickEvent={onClickEventCancel}
              buttonText={"CANCEL"}
              todoid={editInputObj.id}
            />
          </div>
        )}

        {
          <div className="error-container">
            {errorInputField.editInput.errorMessage && (
              <label className="error-input">
                {errorInputField.editInput.errorMessage}
              </label>
            )}
          </div>
        }
      </div>
    </div>
  );
};
