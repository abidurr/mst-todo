import "./index.css";
import React from "react";
import { render } from "react-dom";
import { types, getSnapshot } from "mobx-state-tree";

const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false)
    })
    .actions(self => {
        function setName(newName) {
            self.name = newName;
        }
        function toggle() {
            self.done = !self.done;
        }
        return { setName, toggle }
    });

const User = types.model({
    name: types.optional(types.string, ""),
});

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.optional(types.map(Todo), {})
    })
    .actions(self => {
        function addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }))
        }
        return { addTodo }
    });

const store = RootStore.create({
  users: {}
})

store.addTodo(1, "GIVE ME COFFEE")
store.todos.get(1).toggle()


render(
    <div>
        Store: {JSON.stringify(getSnapshot(store))}
        <br />
    </div>,
    document.getElementById("root")
);
