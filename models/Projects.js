//models always start with capital letter
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type:String,
        default:"https://i.pinimg.com/736x/bd/a3/ed/bda3edbcdde12a14c477648671e6b9d2.jpg"
    },
    builder: {
        type: String,
        default: ""
    },
    price:{
        type: String,
        required:true
    },
    location: {
        type: String,
        deafult: ""
    },
    rating:{
        type:Number
    },
    builder_rating:{
        type:Number
    },
    location_rating:{
        type:Number
    }
});

const Projects = mongoose.model('projects', ProjectsSchema);
module.exports = Projects;