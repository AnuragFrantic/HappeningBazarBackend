const mongoose = require("mongoose");
const slugify = require("slugify");

// Helper function to generate a unique slug
async function generateUniqueSlug(baseSlug, model) {
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await model.findOne({ url: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${count}`; // Append counter to base slug
        count++;
    }

    return uniqueSlug;
}

const CategoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    position: { type: String },
    url: { type: String, unique: true } // Ensure URL is unique
}, {
    timestamps: true
});

// Pre-save hook to generate the URL
CategoriesSchema.pre('validate', async function (next) {
    if (this.name) {
        const baseSlug = slugify(this.name, { lower: true, strict: true }); // Generate base slug from name
        this.url = await generateUniqueSlug(baseSlug, mongoose.models.Category); // Ensure uniqueness
    }
    next();
});

module.exports = mongoose.model("Category", CategoriesSchema);
