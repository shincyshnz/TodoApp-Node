import React, { useEffect, useRef, useState } from "react";
import "./TodoApp.css";
import { Buttons } from "./Buttons/Buttons";
import { Input } from "./Input/Input";
import { TodoList } from "./TodoList/TodoList";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const API_URL = "http://localhost:3010/api/task";
const API_URL = "https://todo-app-node-server-db.vercel.app/";

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

  // Handling Button click Event for adding new todo
  const onClickEventAdd = async (event) => {
    setEditInputObj({});
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

  // Handling Button click Event for Deleting existing todo
  const onClickEventDelete = async (event, todoId) => {
    setEditInputObj({});
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
      toast.success(`Task deleted successfully`);
    } catch (err) {
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

    const found = todos.find((todo) => todo._id === todoId);
    setInputValue((prev) => ({
      ...prev,
      editInput: found.task,
    }));

    setEditInputObj((prev) => (prev = found));
  };

  // Handling Button click Event for cancel Edit
  const onClickEventCancel = (event) => {
    event.preventDefault();
    setErrorInputField((prev) => ({
      ...prev,
      editInputObj: {
        errorMessage: "",
      },
      addInputObj: {
        errorMessage: "",
      },
    }));
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
      toast.success("Task Updated successfully");
    } catch (err) {
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
    );
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

        {editInputObj._id && (
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
              todoid={editInputObj._id}
            />
            <Buttons
              classNameText={"cancel-button"}
              onClickEvent={onClickEventCancel}
              buttonText={"CANCEL"}
              todoid={editInputObj._id}
            />
          </div>
        )}

        {editInputObj._id && (
          <div className="error-container">
            {errorInputField.editInput.errorMessage && (
              <label className="error-input">
                {errorInputField.editInput.errorMessage}
              </label>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
