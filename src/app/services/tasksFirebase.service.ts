import { computed, inject, Injectable,  signal } from '@angular/core';
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
  tasks: [] as Task[],
};

@Injectable({ providedIn: 'root' })
export class TasksFirebaseService {
  state = signal(initialState);
  firestore = inject(Firestore);

  tasksCollection = collection(
    this.firestore,
    'deelnemers'
  ) as CollectionReference<Task>;

  tasks = computed(() => this.state().tasks);

  async getTasksCollection(): Promise<void> {
    const data = await getDocs(this.tasksCollection);

    const tasks = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    this.state.set({
      ...this.state(),
      tasks: [...tasks],
    });
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
