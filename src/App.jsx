import { useStore } from "./store/store";
import "./App.css";

function App() {
    const [tasks, addTask, updateTask, payments, addPayment, updatePayment] =
        useStore((state) => [
            state.tasks,
            state.addTask,
            state.updateTask,
            state.payments,
            state.addPayment,
            state.updatePayment,
        ]);

    const handleSubmitTask = (e) => {
        e.preventDefault();
        addTask({
            date: e.target["task-date"].value,
            cost: e.target["task-cost"].value,
            description: e.target["task-description"].value,
            confirm: e.target["task-confirm"].checked,
        });
        document.getElementById("add-task").reset();
    };

    const handleSubmitTaskUpdate = (e, id) => {
        e.preventDefault();
        updateTask({
            id,
            date: e.target["task-date"].value,
            cost: e.target["task-cost"].value,
            description: e.target["task-description"].value,
            confirm: e.target["task-confirm"].checked,
        });
        document.getElementById(`update-popover-${id}`).hidePopover();
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        addPayment({
            date: e.target["payment-date"].value,
            amount: e.target["payment-amount"].value,
            description: e.target["payment-description"].value,
            confirm: e.target["payment-confirm"].checked,
        });
        document.getElementById("add-payment").reset();
    };

    const handleSubmitPaymentUpdate = (e, id) => {
        e.preventDefault();
        updatePayment({
            id,
            date: e.target["payment-date"].value,
            amount: e.target["payment-amount"].value,
            description: e.target["payment-description"].value,
            confirm: e.target["payment-confirm"].checked,
        });
        document.getElementById(`update-popover-${id}`).hidePopover();
    };

    const sumTasks = tasks
        .filter((task) => task.confirm)
        .reduce((acc, a) => acc + +a.cost, 0);
    const sumPayments = payments
        .filter((payment) => payment.confirm)
        .reduce((acc, a) => acc + +a.amount, 0);
    const balance = sumTasks - sumPayments;

    return (
        <>
            <div className='salary'>
                <div
                    className='balance'
                    data-balance={balance >= 0 ? "+" : "-"}
                >
                    <div>{balance}</div>
                    <div>balance</div>
                </div>
                <div className='sum-tasks'>
                    <div>{sumTasks}</div>
                    <div>sum of tasks</div>
                </div>
                <div className='sum-payments'>
                    <div>{sumPayments}</div>
                    <div>sum of payments</div>
                </div>
            </div>
            <details>
                <summary>Tasks</summary>
                <details>
                    <summary>Add Task</summary>
                    <form
                        action='submit'
                        id='add-task'
                        onSubmit={handleSubmitTask}
                    >
                        <div>
                            <label htmlFor='task-date'>
                                <span>Date</span>
                                <input type='date' id='task-date' required />
                            </label>
                            <label htmlFor='task-cost'>
                                <span>Cost</span>
                                <input
                                    type='number'
                                    id='task-cost'
                                    required
                                    step='1'
                                    min='1'
                                />
                            </label>
                            <label htmlFor='task-description'>
                                <span>Description</span>
                                <input
                                    type='text'
                                    id='task-description'
                                    required
                                />
                            </label>
                            <label htmlFor='task-confirm'>
                                Confirm
                                <input type='checkbox' id='task-confirm' />
                            </label>
                        </div>
                        <button type='submit'>Add task</button>
                    </form>
                </details>
                <div className='tasks'>
                    {!tasks.length ||
                        tasks
                            .toSorted(
                                (task1, task2) =>
                                    Date.parse(new Date(task1.date)) -
                                    Date.parse(new Date(task2.date))
                            )
                            .map((task) => {
                                return (
                                    <div key={task.id} className='task'>
                                        <div
                                            popover='auto'
                                            id={`update-popover-${task.id}`}
                                            className='popover'
                                        >
                                            <form
                                                action='submit'
                                                id='update-task'
                                                onSubmit={(e) =>
                                                    handleSubmitTaskUpdate(
                                                        e,
                                                        task.id
                                                    )
                                                }
                                            >
                                                <div>
                                                    <label htmlFor='task-date'>
                                                        <span>Date</span>
                                                        <input
                                                            type='date'
                                                            id='task-date'
                                                            required
                                                            defaultValue={
                                                                task.date
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='task-cost'>
                                                        <span>Cost</span>
                                                        <input
                                                            type='number'
                                                            id='task-cost'
                                                            required
                                                            step='1'
                                                            min='1'
                                                            defaultValue={
                                                                task.cost
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='task-description'>
                                                        <span>Description</span>
                                                        <input
                                                            type='text'
                                                            id='task-description'
                                                            required
                                                            defaultValue={
                                                                task.description
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='task-confirm'>
                                                        Confirm
                                                        <input
                                                            type='checkbox'
                                                            id='task-confirm'
                                                            defaultChecked={
                                                                task.confirm
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <button type='submit'>
                                                    Update task
                                                </button>
                                            </form>
                                        </div>

                                        <div className='date'>{task.date}</div>
                                        <div className='cost'>{task.cost}</div>
                                        <div className='description'>
                                            {task.description}
                                        </div>
                                        <div
                                            className='confirm'
                                            data-confirm={
                                                task.confirm
                                                    ? "Confirm"
                                                    : "Not confirm"
                                            }
                                        >
                                            {task.confirm
                                                ? "Confirm"
                                                : "Not confirm"}
                                        </div>
                                        <button
                                            className='update'
                                            popovertarget={`update-popover-${task.id}`}
                                        >
                                            update
                                        </button>
                                    </div>
                                );
                            })}
                </div>
            </details>
            <div>
                {Object.entries(
                    Object.groupBy(tasks, ({ description }) => description)
                )
                    .map((desk) => {
                        return [
                            desk[0],
                            desk[1].reduce(
                                (acc, task) => (acc.push(task.cost), acc),
                                []
                            ),
                        ];
                    })
                    .map((desk) => {
                        return (
                            <div key={desk[0]}>
                                {desk[0]}: {desk[1].toString()} средняя{" "}
                                {Math.round(
                                    desk[1].reduce(
                                        (acc, cost) => acc + +cost,
                                        0
                                    ) / desk[1].length
                                )}
                            </div>
                        );
                    })}
            </div>
            <details>
                <summary>Payments</summary>
                <details>
                    <summary>Add Payment</summary>
                    <form
                        action='submit'
                        id='add-payment'
                        onSubmit={handleSubmitPayment}
                    >
                        <div>
                            <label htmlFor='payment-date'>
                                <span>Date</span>
                                <input type='date' id='payment-date' required />
                            </label>
                            <label htmlFor='payment-amount'>
                                <span>Amount</span>
                                <input
                                    type='number'
                                    id='payment-amount'
                                    required
                                    step='1'
                                    min='1'
                                />
                            </label>
                            <label htmlFor='payment-description'>
                                <span>Description</span>
                                <input
                                    type='text'
                                    id='payment-description'
                                    required
                                />
                            </label>
                            <label htmlFor='payment-confirm'>
                                Confirm
                                <input type='checkbox' id='payment-confirm' />
                            </label>
                        </div>
                        <button type='submit'>Add payment</button>
                    </form>
                </details>
                <div className='payments'>
                    {!payments.length ||
                        payments
                            .toSorted(
                                (payment1, payment2) =>
                                    Date.parse(new Date(payment1.date)) -
                                    Date.parse(new Date(payment2.date))
                            )
                            .map((payment) => {
                                return (
                                    <div key={payment.id} className='payment'>
                                        <div
                                            popover='auto'
                                            id={`update-popover-${payment.id}`}
                                            className='popover'
                                        >
                                            <form
                                                action='submit'
                                                id='update-payment'
                                                onSubmit={(e) =>
                                                    handleSubmitPaymentUpdate(
                                                        e,
                                                        payment.id
                                                    )
                                                }
                                            >
                                                <div>
                                                    <label htmlFor='payment-date'>
                                                        <span>Date</span>
                                                        <input
                                                            type='date'
                                                            id='payment-date'
                                                            required
                                                            defaultValue={
                                                                payment.date
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='payment-amount'>
                                                        <span>Amount</span>
                                                        <input
                                                            type='number'
                                                            id='payment-amount'
                                                            required
                                                            step='1'
                                                            min='1'
                                                            defaultValue={
                                                                payment.amount
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='payment-description'>
                                                        <span>Description</span>
                                                        <input
                                                            type='text'
                                                            id='payment-description'
                                                            required
                                                            defaultValue={
                                                                payment.description
                                                            }
                                                        />
                                                    </label>
                                                    <label htmlFor='payment-confirm'>
                                                        Confirm
                                                        <input
                                                            type='checkbox'
                                                            id='payment-confirm'
                                                            defaultChecked={
                                                                payment.confirm
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <button type='submit'>
                                                    Update payment
                                                </button>
                                            </form>
                                        </div>
                                        <div className='date'>
                                            {payment.date}
                                        </div>
                                        <div className='amount'>
                                            {payment.amount}
                                        </div>
                                        <div className='description'>
                                            {payment.description}
                                        </div>
                                        <div
                                            className='confirm'
                                            data-confirm={
                                                payment.confirm
                                                    ? "Confirm"
                                                    : "Not confirm"
                                            }
                                        >
                                            {payment.confirm
                                                ? "Confirm"
                                                : "Not confirm"}
                                        </div>
                                        <button
                                            className='update'
                                            popovertarget={`update-popover-${payment.id}`}
                                        >
                                            update
                                        </button>
                                    </div>
                                );
                            })}
                </div>
            </details>
        </>
    );
}

export default App;
