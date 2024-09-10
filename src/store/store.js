import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create()(
    persist(
        (set, get) => ({
           /* dbNames: "new db"+Math.round(Math.random()*1000),
            changeDbName: (newDbName) => {

            }*/
            id: 0,
            tasks: [],
            addTask: (newTask) =>
                set((state) => {
                    const nextId = get().id + 1;
                    newTask = { id: nextId, ...newTask };
                    return { id: nextId, tasks: [...state.tasks, newTask] };
                }),
            updateTask: (updatedTask) =>
                set(() => {
                    const filtredTasks = get().tasks.filter(
                        (task) => task.id !== updatedTask.id
                    );
                    return { tasks: [...filtredTasks, updatedTask] };
                }),
            payments: [],
            addPayment: (newPayment) =>
                set((state) => {
                    const nextId = get().id + 1;
                    newPayment = { id: nextId, ...newPayment };
                    return {
                        id: nextId,
                        payments: [...state.payments, newPayment],
                    };
                }),
            updatePayment: (updatedPayment) =>
                set(() => {
                    const filtredPayments = get().payments.filter(
                        (payment) => payment.id !== updatedPayment.id
                    );
                    return { payments: [...filtredPayments, updatedPayment] };
                }),
            clearAll: () => {
                set(()=>{
                    return {tasks: [], payments: []};
                });
            }
        }),
        {
            name: "school-salary3",
        }
    )
);
