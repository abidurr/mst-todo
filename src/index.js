import React from "react";
import { render } from "react-dom";
import { types } from "mobx-state-tree";
import { observer } from "mobx-react";
import { values } from "mobx";
import "./index.css";
import styled from "styled-components";

const randomId = () => Math.floor(Math.random() * 1000).toString(36);

const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false),
        user: types.maybe(types.reference(types.late(() => User))),
    })
    .actions((self) => {
        function setName(newName) {
            self.name = newName;
        }
        function setUser(user) {
            if (user === "") {
                // When selected value is empty, set as undefined
                self.user = undefined;
            } else {
                self.user = user;
            }
        }
        function toggle() {
            self.done = !self.done;
        }

        return { setName, setUser, toggle };
    });

const User = types.model({
    id: types.identifier,
    name: types.optional(types.string, ""),
});

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo),
    })
    .views((self) => ({
        get pendingCount() {
            return values(self.todos).filter((todo) => !todo.done).length;
        },
        get completedCount() {
            return values(self.todos).filter((todo) => todo.done).length;
        },
        getTodosWhereDoneIs(done) {
            return values(self.todos).filter((todo) => todo.done === done);
        },
    }))
    .actions((self) => {
        function addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }));
        }

        return { addTodo };
    });

const store = RootStore.create({
    users: {
        "1": {
            id: "1",
            name: "mweststrate",
        },
        "2": {
            id: "2",
            name: "mattiamanzati",
        },
        "3": {
            id: "3",
            name: "johndoe",
        },
    },
    todos: {
        "1": {
            name: "Eat a cake",
            done: true,
        },
    },
});

const Select = styled.select`
    color: lightgray;
    background: transparent;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid lightgray;
    border-radius: 5px;
`;

const Option = styled.option`
    color: black;
`;

const UserPickerView = observer((props) => (
    <Select
        value={props.user ? props.user.id : ""}
        onChange={(e) => props.onChange(e.target.value)}
    >
        <option value="">-none-</option>
        {values(props.store.users).map((user) => (
            <Option value={user.id}>{user.name}</Option>
        ))}
    </Select>
));

const Input = styled.input`
    color: lightgray;
    background: transparent;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid lightgray;
    border-radius: 5px;
`;

const TodoView = observer((props) => (
    <div>
        <Input
            type="checkbox"
            checked={props.todo.done}
            onChange={(e) => props.todo.toggle()}
        />
        <Input
            type="text"
            value={props.todo.name}
            onChange={(e) => props.todo.setName(e.target.value)}
        />
        <UserPickerView
            user={props.todo.user}
            store={props.store}
            onChange={(userId) => props.todo.setUser(userId)}
        />
    </div>
));

const TodoCounterView = observer((props) => (
    <div>
        {props.store.pendingCount} pending, {props.store.completedCount}{" "}
        completed
    </div>
));

const Button = styled.button`
    color: lightgray;
    background: transparent;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid lightgray;
    border-radius: 5px;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 90vh;
`;

const AppView = observer((props) => (
    <Container>
        <Button onClick={(e) => props.store.addTodo(randomId(), "New Task")}>
            Add Task
        </Button>
        {values(props.store.todos).map((todo) => (
            <TodoView store={props.store} todo={todo} />
        ))}
        <TodoCounterView store={props.store} />
    </Container>
));

render(<AppView store={store} />, document.getElementById("root"));
