import { computed, inject, Injectable,  OnInit,  signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
} from '@angular/fire/firestore';
import { Task } from '../task/task.model';
import { CollectionReference, getDocs } from 'firebase/firestore';

const initialState = {
  currentId: 1 as number,
  tasks: [] as Task[],
};

@Injectable({ providedIn: 'root' })
export class TasksFirebaseService  {
  state = signal(initialState);
  firestore = inject(Firestore);

  tasksCollection = collection(
    this.firestore,
    'deelnemers'
  ) as CollectionReference<Task>;

  tasks = computed(() => this.state().tasks);
  currentNumber = computed(() => this.state().currentId);

  async getTasksCollection(): Promise<void> {
    const data = await getDocs(this.tasksCollection);

    const tasks = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log('tasks', tasks);
    this.state().tasks = [...tasks];
    console.log('state', this.state().tasks);
  }

  async addTask(task: Partial<Task>) {
    await addDoc(this.tasksCollection, { ...task });
    await this.getTasksCollection();
  }

  async deleteTask(id: string) {
    const ref = doc(this.firestore, 'deelnemers', id);

    await deleteDoc(ref);
    await this.getTasksCollection();
  }
}
