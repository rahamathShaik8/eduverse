const express = require("express");
const router = express.Router();

const Resource = require("../models/Resource");

// GET Resources
router.get("/", async (req, res) => {

    try{

        const resources = await Resource.find().sort({createdAt:-1});

        res.json(resources);

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

});

// POST Resource

router.post("/", async(req,res)=>{

    try{

        const {title,subject}=req.body;

        if(!title || !subject){

            return res.status(400).json({
                message:"Title and Subject required"
            });

        }

        const newResource=new Resource({

            title,
            subject

        });

        const savedResource=await newResource.save();

        res.status(201).json(savedResource);

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

module.exports=router;