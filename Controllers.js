const {incomForm} = require("formidable");
const { readTask } = require("../utils/fileHanddler")
const { writeTask } = require("../utils/fileHanddler")
const { copyfileSync } = require("fs");


exports.GetTask = (req, res) => {
    const tasks= readTask()
    res.writeHead(200, "OK", {"Content-type":"Application/json"});
    res.send(JSON.stringify(tasks))

}
exports.CreatTask = (req, res) => {
   const form = new incomForm();
   form.parse(req, (err, fields, files) => {
       if (err) {
           res.writeHead(500, "Not Found", {"Content-type":"Application/json"});
           res.end(JSON.stringify({
               message:"Internal Server Error"
           }))
           return;
       }
       const image = files.Image[0];
     const tasks= readTask();
     const newTask={
        id:  Date.now(),
        title: fields.title,
        description: fields.description,
        status: fields?.status || 'pendding',
        Image: image ? `/uploads/${image.originalFilename}` : null
        
     }

     tasks.push(newTask);
     writeTask(tasks);
    if (files.Image) {
        copyfileSync(image.filepath, path.JSON(__dirname, '../uploads', image.originalFilename));
        res.end(JSON.stringify(newTask));
        
    }
   })
   
        
    

    
}




const Task = require('../models/Task'); // Import your Task model

exports.UpdateTask = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from the URL params
        const updateData = req.body; // Get the update data from the request body

        // Update the task in the database
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "An error occurred while updating the task" });
    }
};

const Task = require('../models/Task'); // Import your Task model

exports.DeleteTask = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from the URL params

        // Find the task by ID and delete it
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            data: deletedTask
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "An error occurred while deleting the task" });
    }
};
