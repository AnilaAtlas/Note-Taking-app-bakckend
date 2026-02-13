import Note from "../models/note_model.js";

export const createNote = (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const newNote = new Note({ title, content });
    newNote.save()
        .then((savedNote) => {
            res.status(201).json(savedNote);
        })
        .catch((error) => {
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const getNotes = (req, res) => {
    Note.find()
        .sort({ createdAt: -1 })
        .then((notes) => {
            res.status(200).json(notes);
        })
        .catch((error) => {
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const updateNote = (req, res) => {
    const { title, content } = req.body;
    Note.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
    )
        .then((updatedNote) => {
            if (!updatedNote) {
                return res.status(404).json({ message: "Note not found" });
            }
            res.status(200).json(updatedNote);
        })
        .catch((error) => {
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const deleteNote = (req, res) => {
    Note.findByIdAndDelete(req.params.id)
        .then((deletedNote) => {
            if (!deletedNote) {
                return res.status(404).json({ message: "Note not found" });
            }
            res.status(200).json({ message: "Note deleted successfully" });
        })
        .catch((error) => {
            res.status(500).json({ message: "Something went wrong" });
        });
};