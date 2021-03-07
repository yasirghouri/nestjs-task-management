import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 2, username: 'Test User' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe('TasksService', () => {
  let taskRepository;
  let tasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  //   describe('getTaskById', () => {
  //     it('calls taskRepository.findOne() and successfuly retrieve and return the task ', async () => {
  //       const mockTask = {
  //         title: 'Test title',
  //         description: 'Test description',
  //       };
  //       taskRepository.findOne.mockResolvedValue(mockTask);
  //       const result = await tasksService.getTaskById(1, mockUser);
  //       expect(result).toEqual(mockTask);
  //       expect(taskRepository.findOne).toHaveBeenCalledWith({
  //         where: { id: 1, userId: mockUser.id },
  //       });
  //     });
  //     it('throws an error as task is not found', () => {
  //       taskRepository.findOne.mockResolvedValue(null);
  //       expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
  //         NotFoundException,
  //       );
  //     });
  //   });

  //   describe('createTask', () => {
  //     it('calls taskRepository.create() and returns the result', async () => {
  //       taskRepository.createTask.mockResolvedValue('some task');

  //       expect(taskRepository.createTask).not.toHaveBeenCalled();
  //       const createTaskDto = { title: 'Test task', description: 'Test desc' };
  //       const result = await tasksService.createTask(createTaskDto, mockUser);
  //       expect(taskRepository.createTask).toHaveBeenCalledWith(
  //         createTaskDto,
  //         mockUser,
  //       );
  //       expect(result).toEqual('some task');
  //     });
  //   });
});
