import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAllByUserId(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: userId } });
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Task> {
    return this.taskRepository.findOne({ where: { id, user: userId } });
  }

  async create(userId: number, taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create({ ...taskData, user: userId });
    return this.taskRepository.save(task);
  }

  async update(id: number, userId: number, taskData: Partial<Task>): Promise<Task> {
    const task = await this.findByIdAndUserId(id, userId);
    if (!task) {
      return null;
    }
    Object.assign(task, taskData);
    return this.taskRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findByIdAndUserId(id, userId);
    if (!task) {
      return null;
    }
    await this.taskRepository.remove(task);
  }
}
