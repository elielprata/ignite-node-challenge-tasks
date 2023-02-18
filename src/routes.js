import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/buil-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.end(
          JSON.stringify({
            status: "error",
            message: "Informe o titulo e a descrição da tarefa.",
          })
        );
      }

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", tasks);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.end(
          JSON.stringify({
            status: "error",
            message: "Informe o titulo e a descrição da tarefa.",
          })
        );
      }

      const task = {
        title,
        description,
        updated_at: new Date(),
      };

      const data = database.update("tasks", id, task);

      if (data.error) {
        return res.writeHead(404).end(JSON.stringify(data));
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const data = database.delete("tasks", id);

      if (data.error) {
        return res.writeHead(404).end(JSON.stringify(data));
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = {
        completed_at: new Date(),
      };

      const data = database.update("tasks", id, task);

      if (data.error) {
        return res.writeHead(404).end(JSON.stringify(data));
      }

      return res.writeHead(204).end();
    },
  },
];
