import { useQuery } from "@apollo/client";
import React from "react";
import { GET_TODOS } from "./apollo/todos";
import { ALLTodosCache, IList } from "./types";
import TodoItem from "./components/TodoItem";
import { useMutation } from "@apollo/client";
import { ADD_TODO } from "./apollo/todos";
import { UPDATE_TODO } from "./apollo/todos";
import { REMOVE_TODO } from "./apollo/todos";

const App = () => {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [input, setInput] = React.useState("");
  const [addTodo, { error: addError }] = useMutation(ADD_TODO, {
    update(cache, { data: { createTodo } }) {
      const previousTodos = cache.readQuery<ALLTodosCache>({
        query: GET_TODOS,
      })?.allTodos;
      cache.writeQuery({
        query: GET_TODOS,
        data: { allTodos: [createTodo, ...(previousTodos as IList[])] },
      });
    },
  });
  const [removeTodo, { error: removeError }] = useMutation(REMOVE_TODO, {
    update(cache, { data: { removeTodo } }) {
      // Directly read the current todos from the cache
      const existingTodos = cache.readQuery<ALLTodosCache>({
        query: GET_TODOS,
      })?.allTodos;

      // Filter out the removed todo
      const newTodos = existingTodos?.filter(
        (todo) => todo.id !== removeTodo.id
      );

      // Write the updated todos back to the cache
      cache.writeQuery({
        query: GET_TODOS,
        data: { allTodos: newTodos },
      });
    },
  });
  console.log(data, error, loading);
  const counter = (): string => {
    if (!data || !data.todos) return "0/0";
    const completed = (data.allTodos as IList[]).filter((todo) => todo.checked);
    return `${completed.length}/${(data.allTodos as IList[]).length}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;
    addTodo({
      variables: {
        text: input,
        checked: false,
      },
    });
    setInput("");
  };

  if (error) return <div>Error</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="mt-5 text-3xl">
        Todo App<span className="text-sm">{counter()}</span>
        <div className="w-5/6 ">
          <form
            onSubmit={handleSubmit}
            className="flex justify-between p-5 my-5 text-4xl border-2 rounded-md showdow-md"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className=" outline-none border-b-[1px] text-xl w-10/12 focus:border-b-[3px]
            "
            />
            <div>
              <button type="submit" className="hover:scale-105">
                +
              </button>
            </div>
          </form>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul>
              {(data.allTodos as IList[]) &&
                data.allTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    handleRemove={removeTodo}
                  />
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
