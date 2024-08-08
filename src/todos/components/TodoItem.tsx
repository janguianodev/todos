"use client";

import { Todo } from "@prisma/client";
import styles from "./TodoItem.module.css";
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";
import { startTransition, useOptimistic } from "react";

interface Props {
  todo: Todo;
  toggleTodo: (id: string, complete: boolean) => Promise<Todo | void>;
}

export const TodoItem = ({ todo, toggleTodo }: Props) => {
  const [todoOptimistic, setTodoOptimistic] = useOptimistic(
    todo,
    (state, newCompleteValue: boolean) => ({
      ...state,
      complete: newCompleteValue,
    })
  );

  const onToggleTodo = async () => {
    try {
      startTransition(() => setTodoOptimistic(!todoOptimistic.complete));

      await toggleTodo(todoOptimistic.id, !todoOptimistic.complete);
    } catch (error) {
      startTransition(() => setTodoOptimistic(!todoOptimistic.complete));
    }
  };

  return (
    <div className={todo.complete ? styles.todoDone : styles.todoPending}>
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div
          // onClick={() =>
          //   toggleTodo(todoOptimistic.id, !todoOptimistic.complete)
          // }
          onClick={onToggleTodo}
          className={`
            flex p-2 rounded-md cursor-pointer
            hover:bg-opacity-60 
            ${todoOptimistic.complete ? "bg-blue-100" : "bg-red-100"}
            
          `}
        >
          {todoOptimistic.complete ? (
            <IoCheckboxOutline size={30} />
          ) : (
            <IoSquareOutline size={30} />
          )}
        </div>

        <div className="text-center sm:text-left">
          {todoOptimistic.description}
        </div>
      </div>
    </div>
  );
};
