const express = require("express");
const { storeCat, getAllCategory, deleteCategory, updateCategory } = require("../controller/Categories");
const { substore, getallsubcat, deletesubcat, updateSubCategory, getbycategory, getAllCategoriesWithSubcategories } = require("../controller/SubCategory");

const upload = require('../Config/Multerconfig');
const { PostRegister, getallRegister, putRegister, deleteRegister, getProfile, getbyUser } = require("../Auth/RegisterController");
const { verifyToken, LoginController, adminAuth, usercheckstatus } = require("../Auth/LoginController");
const { postlocation, getlocation } = require("../controller/LocationController");

const { createBanner, getBanners, updateBanner, deleteBanner } = require("../controller/Multipleimage");
const { createdescription, getalldescription, deletedesc, updatedescription, deleteImage, clearAllImages, descriptionbyuser, getdescriptionbyurl } = require("../controller/DescriptionController");
const { createitem, getallitem, getuserProduct, deleteitem, updateitem, getProductByUrl, getStoreurlbyproduct, findProductByUrl } = require("../controller/ProductController");
const { createContact, getContact } = require("../controller/ContactController");
const { reportraise, getAllreport, getuserreport } = require("../controller/ReportController");
const { createoffer, getalloffer, putoffer, deleteoffer, getOfferByUrl, getuseroffer } = require("../controller/OfferController");
const { createEvent, getallevent, deleteevent, updateevent, eventbyurl } = require("../controller/EventController");
const { createStore, getAllStores, updateStore, deleteStore, getvendorstore, getstores_by_Subcategory_url } = require("../controller/CreateController");
const { createmembership, getallmembership, getmembershipbyid, updatemembership, deletemembership } = require("../controller/MembershipController");
const { createRegistration, getAllRegistrations, getRegistrationById, deleteRegistration, updateRegistration } = require("../controller/EventRegistrationController");


const router = express.Router();

//category api

router.post("/category", verifyToken, adminAuth, upload.single("image"), storeCat);
router.get("/category", getAllCategory);

router.put("/category/:id", upload.single("image"), verifyToken, adminAuth, updateCategory);

router.delete("/deletecategory/:id", verifyToken, adminAuth, deleteCategory);

//subcategory api

router.post("/subcategory", verifyToken, adminAuth, upload.single("image"), substore);
router.get("/subcategory", getallsubcat);

router.get("/subcategory/:id", getbycategory);

router.get('/category_with_subcategory', getAllCategoriesWithSubcategories);


router.delete("/deletesubcategory/:id", verifyToken, adminAuth, deletesubcat);
router.put("/subcategory/:id", verifyToken, adminAuth, upload.single("image"), updateSubCategory);






// Auth
router.post("/register", upload.single("image"), PostRegister);
router.get("/alluser", verifyToken, adminAuth, getallRegister);
router.put("/updateuser", verifyToken, adminAuth, upload.single("image"), putRegister);
router.delete("/register", deleteRegister);

router.get("/user", getbyUser);

router.post('/login', LoginController);
router.get('/profile', getProfile);

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

router.post('/offer', createoffer)
router.get('/offer', getalloffer)
router.put('/offer', putoffer)
router.delete('/offer', deleteoffer)
router.get('/getuseroffer', getuseroffer)

router.get('/getoffer/:url', getOfferByUrl)





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

module.exports = router;
