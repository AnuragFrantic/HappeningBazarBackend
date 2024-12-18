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

        // Update the user's events array
        user.events.push(newEvent._id); // Assuming user.events is an array of event IDs
        await user.save();

        res.status(201).json({ status: "OK", message: "Event Created Successfully", error: 0 });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ status: "ERROR", message: "Event Not Created", error: 1 });
    }
};


// exports.getallevent = async (req, res) => {
//     try {
//         const data = await eventmodal.find()

//         res.status(201).json({ status: "OK", message: "Event fetch Succesfully", error: 0, data });
//     } catch (err) {
//         res.status(500).json({ status: "OK", message: "Event Not Found", error: 1 });
//     }
// }


exports.getallevent = async (req, res) => {
    try {

        // Get state and city from query parameters
        const { state, city } = req.query;

        // Build a filter object
        let filter = {};

        if (state) {
            filter.state = state;
        }
        if (city) {
            filter.city = city;
        }

        // Fetch events based on the filter
        const data = await eventmodal.find(filter);

        res.status(201).json({ status: "OK", message: "Event fetched successfully", error: 0, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "ERROR", message: "Event not found", error: 1 });
    }
};




exports.deleteevent = async (req, res) => {
    const { id } = req.body
    try {
        const data = await eventmodal.findByIdAndDelete(id)

        res.status(201).json({ status: "OK", message: "Event Delete Succesfully", error: 0, data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Event Not deleted", error: 1 });
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
        return res.status(200).send({ message: 'User ID is required' });
    }

    try {
        const updateEvent = await eventmodal.findByIdAndUpdate(id, updatedData, { new: true });
        if (updateEvent.file) {
            updateEvent.image = req.file.path;
        }

        if (!updateEvent) {
            return res.status(500).send({ message: 'Event not found', error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Event  Updated Successfully", error: 0, updateEvent });
    } catch (error) {
        console.error(error);

        res.status(500).json({ status: "OK", message: "An error occurred while updating the user", error: 1 });
    }
};




exports.eventbyurl = async (req, res) => {
    const url = req.params.url;

    try {
        // Fetch the event by URL
        const data = await eventmodal.findOne({ url: url });

        // If event is not found, return a 200 status
        if (!data) {
            return res.status(200).json({
                message: "Event not found",
                error: 1
            });
        }

        // Send the event data if found
        res.status(200).json({
            message: "Event found successfully",
            data: data,
            error: 0
        });

    } catch (err) {
        // Handle errors and return a 500 status code
        console.log(err);
        res.status(500).json({
            message: "Error fetching event",
            error: err.message
        });
    }
};
