// import express from "express";
// const router = express.Router();
// import { createNote, deleteNote, getNotes, updateNote} from "../controllers/note_controller.js";
// router.post("/createnote", createNote);
// router.get("/getnotes", getNotes);
// router.put("/updatenote/:id", updateNote);
// router.delete("/deletenote/:id", deleteNote);
// export default router;


import express from "express";
const router = express.Router();
import { 
    createNote, 
    deleteNote, 
    getNotes, 
    updateNote,
    getNoteById 
} from "../controllers/note_controller.js";

router.post("/createnote", createNote);
router.get("/getnotes", getNotes);
router.get("/getnote/:id", getNoteById);  
router.put("/updatenote/:id", updateNote);
router.delete("/deletenote/:id", deleteNote);

export default router;