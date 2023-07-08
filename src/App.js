import { useState } from 'react';

function App() {
  return <TodoList />;
}

function TodoList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('all');

  return (
    <div className="container">
      <Title />
      {isModalOpen && (
        <TodoForm
          setIsModalOpen={setIsModalOpen}
          todoList={todoList}
          setTodoList={setTodoList}
          isModalOpen={isModalOpen}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      <Controls
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsEditing={setIsEditing}
        filter={filter}
        setFilter={setFilter}
      />
      <List
        todoList={todoList}
        setTodoList={setTodoList}
        setIsModalOpen={setIsModalOpen}
        setIsEditing={setIsEditing}
        filter={filter}
      />
    </div>
  );
}

function Title() {
  return <h1>Todo List</h1>;
}

function Controls({
  isModalOpen,
  setIsModalOpen,
  setIsEditing,
  filter,
  setFilter,
}) {
  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    setIsEditing(false);
  }

  return (
    <div className="controls">
      <button className="open-modal-btn" onClick={toggleModal}>
        {!isModalOpen ? 'Add todo' : 'Close'}
      </button>
      <select onChange={e => setFilter(e.target.value)} value={filter}>
        <option value="all">all</option>
        <option value="complete">complete</option>
        <option value="incomplete">incomplete</option>
      </select>
    </div>
  );
}

function List({ todoList, setTodoList, setIsModalOpen, setIsEditing, filter }) {
  function listToDisplay(str) {
    if (str === 'all') return todoList;
    if (str === 'complete') return todoList.filter(todo => todo.checked);
    if (str === 'incomplete') return todoList.filter(todo => !todo.checked);
  }
  const list = listToDisplay(filter);

  return (
    <ul className="list">
      {todoList.length === 0
        ? 'Add todo to your list'
        : list.map(todo => (
            <ListItem
              key={todo.id}
              todo={todo}
              setTodoList={setTodoList}
              setIsModalOpen={setIsModalOpen}
              setIsEditing={setIsEditing}
            />
          ))}
    </ul>
  );
}

function ListItem({ todo, setTodoList, setIsModalOpen, setIsEditing }) {
  const key = todo.id;

  function deleteTodo() {
    setTodoList(todos => todos.filter(todo => todo.id !== key));
  }

  function openEditModal() {
    setIsModalOpen(true);
    setIsEditing(key);
  }

  return (
    <li
      className={todo.checked ? 'list-item completed' : 'list-item'}
      key={key}
    >
      <div className="list-item-left">
        <input
          type="checkbox"
          defaultChecked={todo.checked}
          onChange={() =>
            setTodoList(todos =>
              todos.map(todo =>
                todo.id === key ? { ...todo, checked: !todo.checked } : todo
              )
            )
          }
        />
        <div className="todo-text">
          <p>{todo.text}</p>
          <span>
            Created: {todo.date} at {todo.time}
          </span>
        </div>
      </div>
      <div className="list-item-right">
        <div className="delete" onClick={deleteTodo}>
          <i className="fa-solid fa-trash"></i>
        </div>
        <div className="edit" onClick={openEditModal}>
          <i className="fa-solid fa-pen-to-square"></i>
        </div>
      </div>
    </li>
  );
}

function TodoForm({ setIsModalOpen, setTodoList, isEditing, setIsEditing }) {
  function createNewTodo(e) {
    e.preventDefault();

    if (e.target[0].value === '') {
      e.target[0].style.border = '1px solid red';
      e.target[0].placeholder = 'Please enter a todo item';
      return;
    }

    const currentDate = new Date();

    const newTodo = {
      id: crypto.randomUUID(),
      text: e.target[0].value,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
      checked: false,
    };

    setTodoList(prev => [...prev, newTodo]);

    setIsModalOpen(false);
    setIsEditing(false);
  }

  function editTodo(e) {
    e.preventDefault();
    const editedText = e.target[0].value;

    setTodoList(todos =>
      todos.map(todo =>
        todo.id === isEditing ? { ...todo, text: editedText } : todo
      )
    );

    setIsModalOpen(false);
    setIsEditing(false);
    return;
  }

  return (
    <form className="todo-form" onSubmit={isEditing ? editTodo : createNewTodo}>
      <label htmlFor="todo">
        {`${isEditing ? 'Edit' : 'Add new '} todo item`}
      </label>
      <input type="text" className="new-todo" autoFocus={true} />
      <button type="submit" className="add-new-todo">
        {`${isEditing ? 'Edit' : 'Add new '} todo item`}
      </button>
    </form>
  );
}

export default App;
