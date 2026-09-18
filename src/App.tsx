/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './component/ErrorNotification/ErrorNotification';
import { Todo, TodoStatus } from './types/Todo';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  //інші ерори
  /*
      Title should not be empty

      Unable to add a todo

      Unable to delete a todo

      Unable to update a todo */

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTodos = getFilteredTodos({ todos, status });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {loading ? (
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        ) : (
          todos.length > 0 && (
            <>
              <TodoList todos={filteredTodos} />
              <Footer todos={todos} status={status} setStatus={setStatus} />
            </>
          )
        )}
      </div>

      <ErrorNotification errorText={error} setErrorText={setError} />
    </div>
  );
};
