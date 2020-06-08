import "./index.css";
import React from "react";
import { render } from "react-dom";
import { types, getSnapshot, applySnapshot } from "mobx-state-tree";

const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false),
    })

    .actions((self) => {
        function setName(newName) {
            self.name = newName;
        }
        function toggle() {
            self.done = !self.done;
        }
        return { setName, toggle };
    });

const User = types.model({
    name: types.optional(types.string, ""),
});

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.optional(types.map(Todo), {}),
    })

    .actions((self) => {
        function addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }));
        }
        return { addTodo };
    });

// First way to do things 
const store = RootStore.create({
    users: {},
    todos: {
        "1": {
            name: "Get coffee",
            done: true
        }
    }
});

// Second way to do things
applySnapshot(store, {
    users: {},
    todos: {
        "1": {
            name: "Make coffee",
            done: false
        }
    }
})

render(
    <div>
        Store: {JSON.stringify(getSnapshot(store))}
        <br />
    </div>,
    document.getElementById("root")
);
