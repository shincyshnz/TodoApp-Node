import React, { useEffect, useRef, useState } from "react";
import "./TodoApp.css";
import { Buttons } from "./Buttons/Buttons";
import { Input } from "./Input/Input";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RenderTodo from "./RenderTodo";

// const API_URL = "http://localhost:3010/api/task";
// const API_URL = "https://todo-app-node-server-db.vercel.app/api/task";
const API_URL = "https://task-node-server.onrender.com/api/task";

export const TodoApp = () => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState({
    addInput: "",
    editInput: "",
  });
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
      setTodos(response?.data);
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
          errorMessage: err.message,
        },
      }));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onClickEventAdd = async (event) => {
    // setEditInputObj({});
    event.preventDefault();
    if (
      errorInputField.addInput.errorMessage &&
      inputValue.addInput === "" &&
      inputValue.editInput === ""
    ) {
      return;
    }

    try {
      const response = await axios(API_URL, {
        method: "POST",
        data: {
          task: inputValue.addInput,
        },
      });
      setTodos((todo) => [response.data, ...todo]);
      setInputValue((prev) => ({
        ...prev,
        addInput: "",
      }));
      toast.success("Task added successfully");
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
          errorMessage: err.response.data.message,
        },
      }));
    }
  };

  const onClickEventDelete = async (event, todoId) => {
    // setEditInputObj({});
    event.preventDefault();

    try {
      const response = await axios(API_URL, {
        method: "DELETE",
        data: {
          _id: todoId,
        },
      });
      const tempTodos = [...todos];
      tempTodos.splice(
        tempTodos.findIndex((todo) => todo._id === response.data._id),
        1
      );
      setTodos(tempTodos);
      toast.warning(`Task deleted successfully`);
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        apiError: {
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
          _id: todo._id,
          task: todo.task,
          isCompleted: !todo.isCompleted,
        },
      });
      const tempTodos = todos.map((todo) => {
        if (todo._id === response.data._id) {
          todo.isCompleted = response.data.isCompleted;
        }
        return todo;
      });
      setTodos(tempTodos);
    } catch (err) {
      setErrorInputField((prev) => ({
        ...prev,
        editInput: {
          errorMessage: err.response?.data.message,
        },
      }));
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-inner-container" ref={inputRef}>
        <h1>Task Manager</h1>
        <div className="add-todo-container">
          <Input
            type={"text"}
            className={"add-input"}
            name={"addInput"}
            placeholderText={"New Task"}
            setInputValue={setInputValue}
            setErrorInputField={setErrorInputField}
            inputValue={inputValue.addInput}
          />
          <Buttons
            classNameText={"add-button"}
            onClickEvent={onClickEventAdd}
            buttonText={"ADD"}
            todoid={""}
          />
        </div>

        {(errorInputField.apiError.errorMessage ||
          errorInputField.addInput.errorMessage) && (
          <div className="error-container">
            <label className="error-input">
              {errorInputField.apiError.errorMessage ||
                errorInputField.addInput.errorMessage}
            </label>
          </div>
        )}


        {todos.length > 0 &&
          todos.map((todo, index) => (
            <RenderTodo
              todos={todos}
              setTodos={setTodos}
              todo={todo}
              key={index}
              toggleIsCompleted={toggleIsCompleted}
              inputValue={inputValue}
              setInputValue={setInputValue}
              setErrorInputField={setErrorInputField}
              onClickEventDelete={onClickEventDelete}
              errorInputField={errorInputField}
              API_URL={API_URL}
            />
          ))}

      </div>
      <ToastContainer />
    </div>
  );
};
