"use client";

import { FormEvent, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import * as todosApi from "../helpers/todos";
import { useRouter } from "next/navigation";
import { createTodo, deleteCompletedTodos } from "../actions/todo-actions";

export const NewTodo = () => {
  const [description, setDescription] = useState("");
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (description.trim().length === 0) return;

    // await createTodo(description); //server action
    await todosApi.createTodo(description); //client action
    router.refresh();
    setDescription("");
  };

  // const onDeleteCompleted = async () => {
  // await todosApi.deleteCompletedTodos();
  // router.refresh();
  // };

  return (
    <form className="flex w-full" onSubmit={onSubmit}>
      <input
        type="text"
        className="w-6/12 -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-sky-500 transition-all"
        placeholder="What needs to be done?"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />

      <button
        type="submit"
        className="flex items-center justify-center rounded ml-2 bg-sky-500 p-2 text-white hover:bg-sky-700 transition-all"
      >
        Create
      </button>

      <span className="flex flex-1"></span>

      <button
        type="button"
        className="flex items-center justify-center rounded ml-2 bg-red-400 p-2 text-white hover:bg-red-700 transition-all"
        onClick={() => deleteCompletedTodos()}
      >
        <IoTrashOutline />
        <span className="ml-2">Delete completed</span>
      </button>
    </form>
  );
};
