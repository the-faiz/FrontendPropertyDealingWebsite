const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Projects = require('../models/Projects');
const { body, validationResult } = require('express-validator');

//Route1 :get all  project : GET:"/api/projects/fetchprojects" . No login required
router.get('/fetchprojects',async (req, res) => {
    // console.log("Trending request");
    try {
        const projects = await Projects.find({ rating: { $gt: 0 } }); 
        res.json(projects);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some internal server error occured");
    }
})


//Route 4: Superuser route to add projects "POST:/api/projects/addproject" . Login required
router.post('/addproject', async (req, res) => {
    //If there are errors return Bad request and the error
    try {
        const { title, description, image, builder, price, location, rating, builder_rating, location_rating } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const project = new Projects({
            title, description, image, builder, price, location, rating, builder_rating, location_rating
        })
        const saveProject = await project.save();
        res.json(saveProject);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some internal server error occured");
    }


})




module.exports = router