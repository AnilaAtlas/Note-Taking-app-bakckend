import express from "express";
const router = express.Router();
import { createNote, deleteNote, getNotes, updateNote} from "../controllers/note_controller.js";
router.post("/createnote", createNote);
router.get("/getnotes", getNotes);
router.put("/updatenote/:id", updateNote);
router.delete("/deletenote/:id", deleteNote);
export default router;