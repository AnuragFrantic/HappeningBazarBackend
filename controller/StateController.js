// stateController.js
const states = require('../State/State');

// Get all states
exports.getAllStates = (req, res) => {
    try {
        res.status(200).json({ message: "State Fetch Succesfully", data: states, error: 0 });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};

// Get a state by ISO code
exports.getStateByIsoCode = (req, res) => {
    try {
        const isoCode = req.params.isoCode.toUpperCase();
        const state = states.find(state => state.isoCode === isoCode);
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};
