import Note from "../models/note_model.js";

// CREATE NOTE
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const sessionId = req.headers['x-session-id'];
        
        // Validation
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Title and content are required" 
            });
        }
        
        if (!sessionId) {
            return res.status(400).json({ 
                success: false,
                message: "Session ID is required" 
            });
        }
        
        // Trim input to prevent empty strings
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        
        if (trimmedTitle === '' || trimmedContent === '') {
            return res.status(400).json({
                success: false,
                message: "Title and content cannot be empty"
            });
        }
        
        // Create new note
        const newNote = new Note({ 
            title: trimmedTitle, 
            content: trimmedContent, 
            sessionId 
        });
        
        const savedNote = await newNote.save();
        
        res.status(201).json({
            success: true,
            data: savedNote,
            message: "Note created successfully"
        });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong while creating note",
            error: error.message 
        });
    }
};

// GET ALL NOTES
export const getNotes = async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({ 
                success: false,
                message: "Session ID is required" 
            });
        }

        const notes = await Note.find({ sessionId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: notes,
            count: notes.length,
            message: "Notes fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong while fetching notes",
            error: error.message 
        });
    }
};

// UPDATE NOTE
export const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({ 
                success: false,
                message: "Session ID is required" 
            });
        }

        // Prepare update object (only update fields that are provided)
        const updateData = {};
        if (title !== undefined) {
            const trimmedTitle = title.trim();
            if (trimmedTitle === '') {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty"
                });
            }
            updateData.title = trimmedTitle;
        }
        
        if (content !== undefined) {
            const trimmedContent = content.trim();
            if (trimmedContent === '') {
                return res.status(400).json({
                    success: false,
                    message: "Content cannot be empty"
                });
            }
            updateData.content = trimmedContent;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields to update"
            });
        }

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, sessionId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ 
                success: false,
                message: "Note not found or you don't have permission" 
            });
        }

        res.status(200).json({
            success: true,
            data: updatedNote,
            message: "Note updated successfully"
        });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong while updating note",
            error: error.message 
        });
    }
};

// DELETE NOTE
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({ 
                success: false,
                message: "Session ID is required" 
            });
        }

        const deletedNote = await Note.findOneAndDelete({ _id: id, sessionId });

        if (!deletedNote) {
            return res.status(404).json({ 
                success: false,
                message: "Note not found or you don't have permission" 
            });
        }

        res.status(200).json({ 
            success: true,
            message: "Note deleted successfully",
            data: deletedNote
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong while deleting note",
            error: error.message 
        });
    }
};

// Optional: Get single note by ID
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({ 
                success: false,
                message: "Session ID is required" 
            });
        }

        const note = await Note.findOne({ _id: id, sessionId });

        if (!note) {
            return res.status(404).json({ 
                success: false,
                message: "Note not found or you don't have permission" 
            });
        }

        res.status(200).json({
            success: true,
            data: note,
            message: "Note fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong while fetching note",
            error: error.message 
        });
    }
};