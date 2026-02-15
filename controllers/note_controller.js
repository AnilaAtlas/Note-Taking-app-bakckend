import Note from "../models/note_model.js";

export const createNote = (req, res) => {
    const { title, content } = req.body;
    const sessionId = req.headers['x-session-id'];
    
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    
    const newNote = new Note({ title, content, sessionId });
    newNote.save()
        .then((savedNote) => {
            res.status(201).json(savedNote);
        })
        .catch((error) => {
            console.error("Error creating note:", error);
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const getNotes = (req, res) => {
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    Note.find({ sessionId })
        .sort({ createdAt: -1 })
        .then((notes) => {
            res.status(200).json(notes);
        })
        .catch((error) => {
            console.error("Error fetching notes:", error);
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const updateNote = (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    Note.findOneAndUpdate(
        { _id: id, sessionId },
        { title, content },
        { new: true }
    )
        .then((updatedNote) => {
            if (!updatedNote) {
                return res.status(404).json({ message: "Note not found or you don't have permission" });
            }
            res.status(200).json(updatedNote);
        })
        .catch((error) => {
            console.error("Error updating note:", error);
            res.status(500).json({ message: "Something went wrong" });
        });
};

export const deleteNote = (req, res) => {
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    Note.findOneAndDelete({ _id: id, sessionId })
        .then((deletedNote) => {
            if (!deletedNote) {
                return res.status(404).json({ message: "Note not found or you don't have permission" });
            }
            res.status(200).json({ message: "Note deleted successfully" });
        })
        .catch((error) => {
            console.error("Error deleting note:", error);
            res.status(500).json({ message: "Something went wrong" });
        });
};
