const mongoose = require("mongoose");
const { default: slugify } = require("slugify");


const SubCategorySchema = new mongoose.Schema({
    title: { type: String },
    image: { type: String },
    type: { type: String },
    status: { type: String },
    review: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    url: {
        type: String,
        unique: true,
        required: true
    },

}, {
    timestamps: true
})

async function generateUniqueSlug(instance, baseSlug, counter = 1) {

    const newSlug = `${baseSlug}-${counter}`;


    const existing = await mongoose.models.SubCategory.findOne({ url: newSlug });


    if (existing) {
        return generateUniqueSlug(instance, baseSlug, counter + 1);
    }


    return newSlug;
}


SubCategorySchema.pre('validate', async function (next) {
    if (this.type) {

        let baseSlug = slugify(this.type, { lower: true, remove: /[*+~.()'"!:@/]/g });


        const existingSubcategory = await mongoose.models.SubCategory.findOne({ url: baseSlug, _id: { $ne: this._id } });

        if (existingSubcategory) {

            this.url = await generateUniqueSlug(this, baseSlug);
        } else {

            this.url = baseSlug;
        }
    }
    next();
});

module.exports = mongoose.model("SubCategory", SubCategorySchema)