import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  await prisma.todo.deleteMany(); // Delete all todos
  await prisma.user.deleteMany(); // Delete all todos

  const user = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: bcrypt.hashSync("admin"),
      roles: ["admin", "superuser", "client"],
      todos: {
        create: [
          { description: "Soul stone", complete: true },
          { description: "Power stone" },
          { description: "Time stone" },
          { description: "Space stone" },
          { description: "Reality stone" },
          { description: "Mind stone" },
          { description: "Infinity gauntlet" },
        ],
      },
    },
  });

  // await prisma.todo.createMany({
  //   data: [
  //     { description: "Soul stone", complete: true },
  //     { description: "Power stone" },
  //     { description: "Time stone" },
  //     { description: "Space stone" },
  //     { description: "Reality stone" },
  //     { description: "Mind stone" },
  //     { description: "Infinity gauntlet" },
  //   ],
  // });

  return NextResponse.json({
    message: "Seed executed successfully",
  });
}
