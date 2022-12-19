import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTodoDto,
  EditTodoDto,
} from './dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  getTodos(userId: number) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  getTodoById(userId: number, todoId: number) {
    return this.prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });
  }

  async createTodo(
    userId: number,
    dto: CreateTodoDto,
  ) {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        ...dto,
      },
    });

    return todo;
  }

  async editTodoById(
    userId: number,
    todoId: number,
    dto: EditTodoDto,
  ) {
    const todo =
      await this.prisma.todo.findUnique({
        where: {
          id: todoId,
        },
      });
    if (!todo || todo.userId !== userId)
      throw new ForbiddenException(
        'Acces denied',
      );
    return this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTodoById(
    userId: number,
    todoId: number,
  ) {
    const todo =
      await this.prisma.todo.findUnique({
        where: {
          id: todoId,
        },
      });
    if (!todo || todo.userId !== userId)
      throw new ForbiddenException(
        'Acces denied',
      );
    await this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
  }
}
