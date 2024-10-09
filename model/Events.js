const mongoose = require('mongoose');
const slugify = require('slugify'); // Assuming you are using 'slugify' for URL generation

const EventSchema = new mongoose.Schema({
    image: { type: String },
    title: { type: String },
    date: { type: String },
    short_detail: { type: String },
    state: { type: String },
    detail: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, required: true },
    // store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    amount: { type: String },
    url: {
        type: String,
        unique: true,
        required: true
    },
}, {
    timestamps: true
});

// Function to generate unique slugs for events
async function generateUniqueSlug(baseSlug, counter = 1) {
    const newSlug = `${baseSlug}-${counter}`;

    // Check if any other event has this slug
    const existing = await mongoose.models.Event.findOne({ url: newSlug });

    if (existing) {
        // If slug exists, increment counter and try again
        return generateUniqueSlug(baseSlug, counter + 1);
    }

    return newSlug;
}

// Pre-validate hook to generate a unique URL (slug) for the event
EventSchema.pre('validate', async function (next) {
    if (this.title) {
        let baseSlug = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@/]/g });

        // Check if an event with the same slug exists, excluding this one
        const existingEvent = await mongoose.models.Event.findOne({ url: baseSlug, _id: { $ne: this._id } });

        if (existingEvent) {
            // If the base slug is taken, generate a new unique slug
            this.url = await generateUniqueSlug(baseSlug);
        } else {
            // If the base slug is free, use it
            this.url = baseSlug;
        }
    }
    next();
});

module.exports = mongoose.model('Event', EventSchema);
