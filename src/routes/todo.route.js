import express from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.conntroller.js";
import { authenticate } from "../middleware/verifyJwt.js";

const router = express.Router();

router.use(authenticate);

router.post("/create", createTodo);
router.get("/get-todos", getAllTodos);
router.get("/:todoId", getTodoById);
router.patch("/:todoId", updateTodo);
router.delete("/:todoId", deleteTodo);

export default router;