"use server";

import prisma from "@/app/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const sleep = async (seconds: number = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
};

export const toggleTodo = async (
  id: string,
  complete: boolean
): Promise<Todo> => {
  // await sleep(3);
  const todo = await prisma.todo.findFirst({ where: { id } });

  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { complete },
  });

  revalidatePath("/dashboard/server-todos");

  return updatedTodo;
};

export const createTodo = async (description: string, userId: string) => {
  try {
    const newTodo = await prisma.todo.create({
      data: { description, userId: "..." },
    });

    revalidatePath("/dashboard/server-todos");

    return newTodo;
  } catch (error) {
    return "Error creating todo";
  }
};

export const deleteCompletedTodos = async (): Promise<void> => {
  await prisma.todo.deleteMany({ where: { complete: true } });
  revalidatePath("/dashboard/server-todos");
};
