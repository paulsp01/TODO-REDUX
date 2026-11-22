import { Todo } from "../models/todo.model.js"
import asyncHandler from "../utils/asyncHandler.js"


export const createTodo = asyncHandler(async (req, res) => {
   try {
     const {title,description}=req.body

    if(!title || !description){
        return res.status(400).json({message:"All Fields Are Required"})
    }

    const todo=await Todo.create({
        title,description,completed:true,user:req.user._id
    })

    if(!todo){
        return res.status(400).json({message:"Todo is not created successfully"})
    }

return res.status(200).json({message:"Todo created successfully",todo})
   } catch (error) {
    return res.status(500).json({message:"Internal server error",error})
   }
})


export const getAllTodos = asyncHandler(async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user._id
        });

        return res.status(200).json({
            message: "Todos fetched successfully",
            totalTodos: todos.length,
            todos
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
          error
        });
    }
})

export const getTodoById = asyncHandler(async (req, res) => {
    try {
        const  todoId = req.params.todoId;

        const todo = await Todo.findOne({
            _id: todoId,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            message: "Todo fetched successfully",
            todo
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
          error
        });
    }
})

export const updateTodo = asyncHandler(async (req, res) => {
    try {
        const todoId = req.params.todoId;
        if(!todoId){
            return res.status(400).json({message:"Id not found"})
        }

        const { title, description, completed } = req.body;

        const updatedTodo = await Todo.findOneAndUpdate(
            {
                _id: todoId,
                user: req.user._id
            },
            {$set: {
                    title,
                    description,
                    completed
                }
            },
            {
                new: true
              
            }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            message: "Todo updated successfully",
            updatedTodo
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
          error
        });
    }
})

export const deleteTodo = asyncHandler(async (req, res) => {
    try {
        const todoId = req.params.todoId;
         if(!todoId){
            return res.status(400).json({message:"Id not found"})
        }

        const deleteTodo=await Todo.findOneAndDelete(
            {
                _id:todoId,
                user:req.user._id
            },
            
        )

           if (!deleteTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            message: "Todo deleted successfully",
            deleteTodo
        });


    } catch (error) {

         return res.status(500).json({
            message: "Internal server error",
            error
        });

    }
});