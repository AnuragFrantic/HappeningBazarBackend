const BlogModal = require('../model/Blogs')

// Create a new blog
exports.storeBlog = async (req, res) => {
    try {
        const create = new BlogModal(req.body);

        // If an image is uploaded, assign its path to the blog's image field
        if (req.file) {
            create.image = req.file.path;
        }

        await create.save();
        res.status(200).send({ status: "OK", message: "Blog Created Successfully", error: 0 });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const data = await BlogModal.find();
        res.status(200).send({ status: "OK", data: data, error: 0 });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const updateData = req.body;

        // If a file is uploaded, set the image path
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Find the blog by ID and update it
        const updatedBlog = await BlogModal.findByIdAndUpdate(blogId, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(500).send({ status: "Failed", message: "Blog not found", error: 1 });
        }

        res.status(200).send({ status: "OK", message: "Blog Updated Successfully", data: updatedBlog, error: 0 });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await BlogModal.findByIdAndDelete(req.params.id);

        if (!deletedBlog) {
            return res.status(500).send({ status: "Failed", message: "Blog not found", error: 1 });
        }

        res.status(200).send({ status: "OK", message: "Blog deleted successfully", data: deletedBlog, error: 0 });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
};


exports.blogsbyurl = async (req, res) => {
    try {
        let url = req.params.url
        const data = await BlogModal.findOne({ url: url });
        res.status(200).send({ status: "OK", message: "Blog Fetch Successfully", data: data, error: 0 });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
}
