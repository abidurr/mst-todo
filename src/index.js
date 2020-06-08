import React from "react";
import { render } from "react-dom";
import { types, getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";

const Todo = types.model({
  name: "",
  done: false
});

const User = types.model({
  name: ""
});

const john = User.create();
const eat = Todo.create({ name: "eat" });
render(
  <div>
    John: {JSON.stringify(getSnapshot(john))}
    <br />
    Eat TODO: {JSON.stringify(getSnapshot(eat))}
  </div>,
  document.getElementById("root")
);
