const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    image: { type: String },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, unique: true, required: true },
    type: { type: String, required: true }
}, {
    timestamps: true
});

// Function to generate a unique slug for the blog based on the title
async function generateUniqueSlug(instance, baseSlug, counter = 1) {
    const newSlug = `${baseSlug}-${counter}`;
    const existing = await mongoose.models.Blog.findOne({ url: newSlug });
    if (existing) {
        return generateUniqueSlug(instance, baseSlug, counter + 1);
    }
    return newSlug;
}

// Pre-validate hook to generate a URL slug based on the title
BlogSchema.pre('validate', async function (next) {
    if (this.title) {
        let baseSlug = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@/]/g });
        const existingBlog = await mongoose.models.Blog.findOne({ url: baseSlug, _id: { $ne: this._id } });
        if (existingBlog) {
            this.url = await generateUniqueSlug(this, baseSlug);
        } else {
            this.url = baseSlug;
        }
    }
    next();
});

module.exports = mongoose.model("Blog", BlogSchema);
