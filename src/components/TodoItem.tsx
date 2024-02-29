import { FC, useState } from "react";
import { IList } from "../types";
import { FiEdit, FiMinusCircle } from "react-icons/fi";

interface TodoItemProps {
  todo: IList;
  handleRemove: (oprtions: { variables: { id: number } }) => void;
}

const TodoItem: FC<TodoItemProps> = ({ todo, handleRemove }) => {
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState(todo.text);
  return (
    <li className="flex items-center justify-between min-w-full p-5 my-3 text-2xl duration-300 ease-in border-2 rounded-md showder-md hover:scale-105">
      <div className="flex items-center w-10/12">
        <input
          type="checkbox"
          checked={todo.checked}
          className="hover:scale-105 hover:cursor-pointer"
        />

        <input
          type="text"
          value={task}
          disabled={!edit}
          onChange={(e) => setTask(e.target.value)}
          className={`overflow-hidden resize-none outline-none ${
            todo.checked ? "line-through text-stone-700" : ""
          } h-[25px] text-xl w-full px-3 disabled:bg-transparent focus:border-b-[3px]`}
        />
      </div>
      <div className="cursor-pointer flex justify-between w-1/6">
        <FiEdit className="hover:scale-105" onClick={() => setEdit(!edit)} />
        <FiMinusCircle
          className="hover:scale-105 mx-2 "
          onClick={() => handleRemove({ variables: { id: todo.id } })}
        />
      </div>
    </li>
  );
};

export default TodoItem;
