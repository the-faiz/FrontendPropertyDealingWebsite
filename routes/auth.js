const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

//Json web token for maintaining sessions
const JWT_SECRET = "KGPisthebestiit";


// Route 1: Create a user using :POST "/api/auth/createuser" .No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Minimum length of password is 5').isLength({ min: 5 }),
], async (req, res) => {
    let success=false;
    // console.log("Adding the user");
    //If there are errors return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //Check whether a user with the email exists or not
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" });
        }

        //Securing the pasword
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,name:req.body.name,authToken: authToken });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some internal server error occured");
    }
})


// Route 2: Authenticating a user using : Post "/api/auth/login". No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success =false;
    //If there are errors return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success:success,error: "try loggin with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success:success,error: "try loggin with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success,name:user.name,authToken});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some internal server error occured");
    }
})


//route 3: Get the logged user details:POST"/api/auth/getuser". Login required

router.post('/getuser',fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some internal server error occured");
    }
})

module.exports = router