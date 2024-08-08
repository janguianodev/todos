import prisma from "@/app/lib/prisma";
import { getUserServerSession } from "@/auth/actions/auth-actions";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");

  if (isNaN(take)) {
    return NextResponse.json(
      {
        message: "Invalid take parameter",
      },
      { status: 400 }
    );
  }

  if (isNaN(skip)) {
    return NextResponse.json(
      {
        message: "Invalid skip parameter",
      },
      { status: 400 }
    );
  }

  const todos = await prisma.todo.findMany({ take, skip });

  return NextResponse.json(todos);
}

const postSchema = yup.object().shape({
  description: yup.string().required(),
  complete: yup.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const user = await getUserServerSession();

  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { complete, description } = postSchema.validateSync(
      await request.json()
    );

    const newTodo = await prisma.todo.create({
      data: {
        description,
        complete,
        userId: user.id,
      },
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = await getUserServerSession();

  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await prisma.todo.deleteMany({
      where: { complete: true, userId: user.id },
    });

    return NextResponse.json("Items deleted");
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
