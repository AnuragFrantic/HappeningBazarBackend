const eventmodal = require('../model/Events')
const UserModel = require('../model/Register')


exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        if (req.file) {
            eventData.image = req.file.path;
        }

        // Create the event
        const newEvent = new eventmodal(eventData);
        await newEvent.save();

        // Find the user associated with the event
        const user = await UserModel.findById({ "_id": req.body.created_by }); // Assuming userId is set in the request
        console.log(user)
        // Update the user's events array
        user.events.push(newEvent._id); // Assuming user.events is an array of event IDs
        await user.save();

        res.status(201).json({ status: "OK", message: "Event Created Successfully", error: "0" });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ status: "ERROR", message: "Event Not Created", error: "1" });
    }
};


exports.getallevent = async (req, res) => {
    try {
        const data = await eventmodal.find()

        res.status(201).json({ status: "OK", message: "Event fetch Succesfully", error: "0", data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Event Not Found", error: "1" });
    }
}



exports.deleteevent = async (req, res) => {
    const { id } = req.body
    try {
        const data = await eventmodal.findByIdAndDelete(id)

        res.status(201).json({ status: "OK", message: "Event Delete Succesfully", error: "0", data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Event Not deleted", error: "1" });
    }
}


// exports.updateevent = async (req, res) => {
//     const { id } = req.body
//     try {
//         const data = await eventmodal.findByIdAndUpdate(id)
//         if (req.file) {
//             data.image = req.file.path;
//         }
//     }
// }


exports.updateevent = async (req, res) => {
    const { id, ...updatedData } = req.body;


    if (!id) {
        return res.status(400).send({ message: 'User ID is required' });
    }

    try {
        const updateEvent = await eventmodal.findByIdAndUpdate(id, updatedData, { new: true });
        if (updateEvent.file) {
            updateEvent.image = req.file.path;
        }

        if (!updateEvent) {
            return res.status(404).send({ message: 'Event not found', error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Event  Updated Successfully", error: "0", updateEvent });
    } catch (error) {
        console.error(error);

        res.status(500).json({ status: "OK", message: "An error occurred while updating the user", error: "1" });
    }
};
