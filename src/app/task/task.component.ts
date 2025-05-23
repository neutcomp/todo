import {  Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { TasksFirebaseService } from '../services/tasksFirebase.service';
import { Task } from './task.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [MatCard, JsonPipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  taskFirebaseService = inject(TasksFirebaseService);
  tasks = this.taskFirebaseService.tasks;
  state = this.taskFirebaseService.state;

  async ngOnInit(): Promise<void> {
    await this.taskFirebaseService.getTasksCollection();

    console.log('ngOnInit');
    console.log(this.state().tasks);
    console.log(this.tasks());
  }

  async addTask(task: Partial<Task>) {
    await this.taskFirebaseService.addTask(task);
  }

  async deleteTask(id: string) {
    await this.taskFirebaseService.deleteTask(id);
  }
}
