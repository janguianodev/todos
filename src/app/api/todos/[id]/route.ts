import prisma from "@/app/lib/prisma";
import { getUserServerSession } from "@/auth/actions/auth-actions";
import { Todo } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

interface Segments {
  params: {
    id: string;
  };
}

const getTodo = async (id: string): Promise<Todo | null> => {
  const user = await getUserServerSession();

  if (!user) return null;

  const todo = await prisma.todo.findFirst({ where: { id } });

  if (todo?.userId !== user.id) {
    return null;
  }

  return todo;
};

export async function GET(request: Request, { params }: Segments) {
  const { id } = params;

  const todo = await getTodo(id);

  if (!todo) {
    return NextResponse.json(
      { message: `Todo with id: '${id}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    todo,
  });
}

const putSchema = yup.object().shape({
  description: yup.string().optional(),
  complete: yup.boolean().optional(),
});

export async function PUT(request: Request, { params }: Segments) {
  const { id } = params;

  const todo = await getTodo(id);

  if (!todo) {
    return NextResponse.json(
      { message: `Todo with id: '${id}' not found` },
      { status: 404 }
    );
  }

  try {
    const { complete, description, ...rest } = await putSchema.validateSync(
      await request.json()
    );

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { complete, description },
    });

    return NextResponse.json({
      updatedTodo,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
