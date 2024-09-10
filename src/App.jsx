import { useStore } from "./store/store";
import "./App.css";

function App() {
    const [tasks, addTask, updateTask, payments, addPayment, updatePayment, clearAll] =
        useStore((state) => [
            state.tasks,
            state.addTask,
            state.updateTask,
            state.payments,
            state.addPayment,
            state.updatePayment,
            state.clearAll
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

    const statTasks = Object.entries(
        Object.groupBy(tasks, ({ description }) => description)
    )
        .map((desk) => {
            return [
                desk[0],
                desk[1].reduce((acc, task) => (acc.push(task.cost), acc), []),
            ];
        })
        .map((desk) => {
            return (
                <div key={desk[0]}>
                    {desk[0]}: {desk[1].join(", ")} ={" "}
                    {Math.round(
                        desk[1].reduce((acc, cost) => acc + +cost, 0) /
                            desk[1].length
                    )}
                </div>
            );
        });

    const statPayments = Object.entries(
        Object.groupBy(payments, ({ description }) => description)
    )
        .map((desk) => {
            return [
                desk[0],
                desk[1].reduce(
                    (acc, payment) => (acc.push(payment.amount), acc),
                    []
                ),
            ];
        })
        .map((desk) => {
            return (
                <div key={desk[0]}>
                    {desk[0]}: {desk[1].join(", ")} ={" "}
                    {desk[1].reduce((acc, cost) => acc + +cost, 0)}
                </div>
            );
        });

        const handleClearAll = () => {
            const confirm = window.confirm('Удалить все данные?');
            if (confirm) clearAll();
        }


    return (
        <>
            <div className='salary'>
                <button 
                    type='button' 
                    className='clear-all'
                    onClick={handleClearAll}
                    >
                        Удалить все данные
                </button>
                <div
                    className='balance'
                    data-balance={balance >= 0 ? "+" : "-"}
                >
                    <div>{balance}</div>
                    <div>баланс</div>
                </div>
                <div className='sum-tasks'>
                    <div>{sumTasks}</div>
                    <div>сумма оценок</div>
                </div>
                <div className='sum-payments'>
                    <div>{sumPayments}</div>
                    <div>сумма денег</div>
                </div>
            </div>
            <details>
                <summary>Оценки</summary>
                <details>
                    <summary>Добавить оценку</summary>
                    <form
                        action='submit'
                        id='add-task'
                        onSubmit={handleSubmitTask}
                    >
                        <div>
                            <label htmlFor='task-date'>
                                <span>Дата</span>
                                <input type='date' id='task-date' required />
                            </label>
                            <label htmlFor='task-cost'>
                                <span>Оценка</span>
                                <input
                                    type='number'
                                    id='task-cost'
                                    required
                                    step='1'
                                    min='1'
                                />
                            </label>
                            <label htmlFor='task-description'>
                                <span>Предмет</span>
                                <input
                                    type='text'
                                    id='task-description'
                                    required
                                />
                            </label>
                            <label htmlFor='task-confirm'>
                                Подтверждено
                                <input type='checkbox' id='task-confirm' />
                            </label>
                        </div>
                        <button type='submit'>Добавить оценку</button>
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
                            .map((task, i) => {
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
                                                        <span>Дата</span>
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
                                                        <span>Оценка</span>
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
                                                        <span>Предмет</span>
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
                                                        Подтверждено
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
                                                    Обновить оценку
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
                                                ? "Подтверждена"
                                                : "Не подтверждена"}
                                        </div>
                                        <button
                                            className='update'
                                            popovertarget={`update-popover-${task.id}`}
                                        >
                                            Обновить
                                        </button>
                                    </div>
                                );
                            })}
                </div>
            </details>
            <div>
                <div>Статистика</div>
                <div>(предет: оценки = средняя)</div>
                {statTasks}
                <div>всего оценок: {tasks.length}</div>
            </div>
            <details>
                <summary>Платежи</summary>
                <details>
                    <summary>Добавить платеж</summary>
                    <form
                        action='submit'
                        id='add-payment'
                        onSubmit={handleSubmitPayment}
                    >
                        <div>
                            <label htmlFor='payment-date'>
                                <span>Дата</span>
                                <input type='date' id='payment-date' required />
                            </label>
                            <label htmlFor='payment-amount'>
                                <span>Сумма</span>
                                <input
                                    type='number'
                                    id='payment-amount'
                                    required
                                    step='1'
                                    min='1'
                                />
                            </label>
                            <label htmlFor='payment-description'>
                                <span>За что / наличка / безнал</span>
                                <input
                                    type='text'
                                    id='payment-description'
                                    required
                                />
                            </label>
                            <label htmlFor='payment-confirm'>
                                Подтверждено
                                <input type='checkbox' id='payment-confirm' />
                            </label>
                        </div>
                        <button type='submit'>Добавить платеж</button>
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
                                                        <span>Дата</span>
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
                                                        <span>Сумма</span>
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
                                                        <span>
                                                            За что / наличка /
                                                            безнал
                                                        </span>
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
                                                        Подтверждено
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
                                                    Обновить платеж
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
                                                ? "Подтвержден"
                                                : "Не подтвержден"}
                                        </div>
                                        <button
                                            className='update'
                                            popovertarget={`update-popover-${payment.id}`}
                                        >
                                            Обновить
                                        </button>
                                    </div>
                                );
                            })}
                </div>
            </details>
            <div>
                <div>Статистика</div>
                <div>(За что / наличка / безнал: платежи = сумма)</div>
                {statPayments}
                <div>всего платежей: {payments.length}</div>
            </div>
        </>
    );
}

export default App;
