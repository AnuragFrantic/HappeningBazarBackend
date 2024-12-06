const express = require("express");
const { storeCat, getAllCategory, deleteCategory, updateCategory } = require("../controller/Categories");
const { substore, getallsubcat, deletesubcat, updateSubCategory, getbycategory, getAllCategoriesWithSubcategories, deleteImageFromSubCategory, deleteImagesubsubCategory, getbycategoryurl } = require("../controller/SubCategory");

const upload = require('../Config/Multerconfig');
const { PostRegister, getallRegister, putRegister, deleteRegister, getbyUser } = require("../Auth/RegisterController");
const { verifyToken, LoginController, adminAuth, usercheckstatus, getProfile } = require("../Auth/LoginController");
const { postlocation, getlocation } = require("../controller/LocationController");

const { createBanner, getBanners, updateBanner, deleteBanner } = require("../controller/Multipleimage");
const { createdescription, getalldescription, deletedesc, updatedescription, deleteImage, clearAllImages, descriptionbyuser, getdescriptionbyurl } = require("../controller/DescriptionController");
const { createitem, getallitem, getuserProduct, deleteitem, updateitem, getProductByUrl, getStoreurlbyproduct, findProductByUrl } = require("../controller/ProductController");
const { createContact, getContact } = require("../controller/ContactController");
const { reportraise, getAllreport, getuserreport } = require("../controller/ReportController");

const { createEvent, getallevent, deleteevent, updateevent, eventbyurl } = require("../controller/EventController");
const { createStore, getAllStores, updateStore, deleteStore, getvendorstore, getstores_by_Subcategory_url } = require("../controller/CreateController");
const { createmembership, getallmembership, getmembershipbyid, updatemembership, deletemembership } = require("../controller/MembershipController");
const { createRegistration, getAllRegistrations, getRegistrationById, deleteRegistration, updateRegistration } = require("../controller/EventRegistrationController");
const { getAllStates, getStateByIsoCode } = require("../controller/StateController");
const { storeBlog, getAllBlogs, updateBlog, deleteBlog, blogsbyurl } = require("../controller/BlogController");
const { validateOfferCode } = require("../controller/AppliedOffercontoller");
const { createOffer, getAllOffers, deleteOffer, getUserOffers, getOfferByUrl, updateOffer } = require("../controller/OfferController");
const { generateOfferCode } = require("../controller/OfferCodeContoller");
const { createFAQ, getAllFAQs, getFAQById, updateFAQ, deleteFAQ } = require("../controller/FaqController");
const { createLead, getAllLeads, getLeadById, updateLead, deleteLead } = require("../controller/LeadController");
const { createReview, getAllReviews, getReviewsByStore, updateReview, deleteReview } = require("../controller/ReviewController");
const { createOrUpdatePolicy, getPolicies, getPolicyByUrl, deletePolicy } = require("../controller/PolicyController");
const authenticateToken = require("../middleware/AuthicateToken");


const router = express.Router();

//category api

router.post("/category", verifyToken, adminAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
]), storeCat);
router.get("/category", getAllCategory);

router.put("/category/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
]), verifyToken, adminAuth, updateCategory);

router.delete("/deletecategory/:id", verifyToken, adminAuth, deleteCategory);

//subcategory api

router.post("/subcategory", verifyToken, adminAuth, upload.array("image", 5), substore);
router.get("/subcategory", getallsubcat);

router.get("/subcategory/:id", getbycategory);
router.get("/subcategoryurl/:url", getbycategoryurl);


router.get('/category_with_subcategory', getAllCategoriesWithSubcategories);


router.delete("/deletesubcategory/:id", verifyToken, adminAuth, deletesubcat);
router.put("/subcategory/:id", verifyToken, adminAuth, upload.array("image", 5), updateSubCategory);


router.delete('/subcategoryimage/:imageId', deleteImagesubsubCategory);




// Auth
router.post("/register", upload.single("image"), PostRegister);
router.get("/alluser", verifyToken, adminAuth, getallRegister);
router.put("/updateuser", verifyToken, adminAuth, upload.single("image"), putRegister);
router.delete("/register", deleteRegister);

router.get("/user", getbyUser);

router.post('/login', LoginController);
router.get('/profile', verifyToken, getProfile);

// Location
router.post("/location", verifyToken, postlocation);
router.get("/location", verifyToken, getlocation);


//banner 

// router.post('/banner', verifyToken, adminAuth, upload.single('image'), createbanner)
// router.get('/banner', verifyToken, adminAuth, getallbanner)
// router.put('/banner', verifyToken, adminAuth, upload.single('image'), putbanner)

router.post('/banner', verifyToken, adminAuth, upload.array('image', 3), createBanner);
router.get('/banner', getBanners);
// router.get('/banners/:id', getBannerById);
router.put('/banner/:id', verifyToken, adminAuth, upload.array('image', 3), updateBanner);
router.delete('/banner/:id', verifyToken, adminAuth, deleteBanner);


//description

router.post("/description", upload.array('image', 8), createdescription)

router.get("/description", getalldescription)

router.delete("/description/:id", deletedesc)

router.get("/getuserdesc/:id", descriptionbyuser)
router.get("/getdescription/:url", getdescriptionbyurl)
router.get('/description/:url', getdescriptionbyurl)




router.put("/description/:id", upload.array('image'), updatedescription);


router.delete("/image/:imageId", deleteImage);


router.delete("/description/:descriptionId/images", clearAllImages);




//product

router.post('/product', upload.array('image', 8), createitem)
router.get('/product', getallitem)

router.get('/getuserproduct', getuserProduct)
router.delete('/product/:id', deleteitem)
router.put('/update_product/:id', upload.array('image'), updateitem);
router.get('/getproduct/:url', getStoreurlbyproduct)
router.get('/product/:url', findProductByUrl)
// router.get('/getstoreproduct/:store', getProductByStore)





//contact us 

router.post('/contact', createContact)
router.get('/contact', getContact)



//report 

router.post('/report', reportraise)
router.get('/report', getAllreport)
router.get('/userreport', getuserreport)



//offer

router.post('/offer', upload.single("image"), createOffer)
router.get('/offer', getAllOffers)
router.put('/offer', upload.single("image"), updateOffer)
router.delete('/offer', deleteOffer)
router.get('/getuseroffer', getUserOffers)

router.get('/getoffer/:url', getOfferByUrl)

router.post('/generate-code', generateOfferCode);


router.post('/apply-offer', validateOfferCode);





//events

router.post('/events', upload.single("image"), createEvent)
router.get('/events', getallevent)
router.delete('/events', deleteevent)
router.put('/events', upload.single("image"), updateevent)
router.get('/events/:url', eventbyurl)



//store

router.post("/store", upload.single("image"), createStore)
router.get("/store", getAllStores)
router.put("/store/:id", upload.single("image"), updateStore)

router.get("/vendorstore/:id", getvendorstore)

router.delete("/store/:id", deleteStore)

router.get('/store/:url', getstores_by_Subcategory_url)



//membership

router.post('/membership', upload.single('image'), createmembership)
router.get('/membership', getallmembership)





router.get('/membership/:id', getmembershipbyid);


router.put('/membership/:id', updatemembership);




router.delete('/membership/:id', deletemembership);


// eventregistration 
router.post('/event_register', createRegistration);
router.get('/event_register', getAllRegistrations);
router.get('/event_register/:id', getRegistrationById);
router.put('/event_register/:id', updateRegistration);
router.delete('/event_register/:id', deleteRegistration);


//state

router.get('/states', getAllStates);


router.get('/states/:isoCode', getStateByIsoCode);

//blogs 


// Create a new blog (with image upload)
router.post("/blogs", upload.single("image"), storeBlog);

// Get all blogs
router.get("/blogs", getAllBlogs);

// Update a blog (with image upload)
router.put("/blogs/:id", upload.single("image"), updateBlog);

// Delete a blog
router.delete("/blogs/:id", deleteBlog);
router.get('/blogs/:url', blogsbyurl)




router.post('/faqs', createFAQ);
router.get('/faqs', getAllFAQs);
router.get('/faqs/:id', getFAQById);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);


//lead


router.post("/leads", createLead);
router.get("/leads", getAllLeads);
router.get("/leads/:id", getLeadById);
router.put("/leads/:id", updateLead);
router.delete("/leads/:id", deleteLead);


//reveiw 


router.post("/reviews", authenticateToken, createReview);
router.get("/reviews", getAllReviews);
router.get("/reviews/store/:storeurl", getReviewsByStore);
router.put("/reviews/:id", authenticateToken, updateReview);
router.delete("/reviews/:id", authenticateToken, deleteReview);




//policy


router.post('/policy', createOrUpdatePolicy);

// Route to get all policies
router.get('/policy', getPolicies);

// Route to get a single policy by URL
router.get('/policy/:url', getPolicyByUrl);

// Route to delete a policy by URL
router.delete('/policy/:url', deletePolicy);

module.exports = router;
