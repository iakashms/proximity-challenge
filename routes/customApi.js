var express = require('express')
var multer  = require('multer')
const bodyParser = require('body-parser')
const Subject = require('../Schema/Subject')
const Student = require('../Schema/Student')
const Instructor = require('../Schema/Instructor')
const Course = require('../Schema/Course')
const Tag = require('../Schema/Tag')
const Video = require('../Schema/Video')
const bcrypt = require('bcryptjs')
var router = express.Router()
var jsonParser = bodyParser.json()
var encodeParser = bodyParser.urlencoded({ extended: true })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
var upload = multer({ storage: storage })

router.get('/',(req,res)=>{
    res.send({"status" : 200, "message" : "API is Live!"})
})

router.get('/:entity',async (req, res) => {
    try{
        let query = {}, populate = [], selectQuery = {};
        let queryParams = req.query;
        let schemaNames = ['subject','course','tag']
        let entity = req.params.entity.toLowerCase() || null;
        let name = req.params.name || null;
        let functionName = `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`;
        schemaNames.indexOf(entity) >= 0 ? query["is_active"] = true : false
        if(queryParams.query){
            query = Object.assign(JSON.parse(queryParams.query),query)
        }
        if(queryParams.populate){
            let populateQuery = JSON.parse(queryParams.populate)
            if(Array.isArray(populateQuery) && populateQuery.length){
                populate = populateQuery
            }
        }
        if(queryParams.select){
            selectQuery = Object.assign(JSON.parse(queryParams.select),selectQuery)
        }
        let details = await eval(functionName).find(query,selectQuery).populate(populate);
        return res.send({status : 200, data : details });
    }catch(e){
        console.log(e)
        return res.send({status : 200, message : req.params, errorMessage : e.message })
    }
})

router.patch('/:entity/:Id',jsonParser,async (req, res) => {
    try{
        let entity = req.params.entity.toLowerCase() || null;
        let id = req.params.Id || null;
        let functionName = `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`;
        let details = await eval(functionName).findOneAndUpdate(
            { _id: id },
            { $set: req.body }
        )
        return res.send({status : 200, message : details });
    }catch(e){
        return res.send({status : 200, message : req.params, errorMessage : e.message })
    }
})

router.get('/:entity/:Id',async (req, res) => {
    try{
        let entity = req.params.entity.toLowerCase() || null;
        let Id = req.params.Id || null;
        let functionName = `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`;
        let query = {_id:Id}
        let details = await eval(functionName).findOne(query)
        return res.send({status : 200, data : details });
    }catch(e){
        return res.send({status : 200, message : req.params, errorMessage : e.message })
    }
})

router.post('/:entity',jsonParser,async (req, res) => {
    try{
        let customErrors = {
            "status": 200,
            "errors": []
        }
        let entity = req.params.entity || '';
        switch (entity){
            case 'instructor' : {
                const { name, email, password, username, phone, gender, age, subjects_handeled} = req.body;
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                let [getPhone,getInstructor] = await Promise.all([
                    Instructor.findOne({phone:phone}),
                    Instructor.findOne({username:username})
                ])
                if(getPhone && getPhone._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${phone} Mobile Number is already registered.`,
                        "param": "phone"
                    })
                    return res.status(200).json(customErrors)
                }
                if(getInstructor && getInstructor._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${username} is Already Taken.`,
                        "param": "phone"
                    })
                    return res.status(200).json(customErrors)
                }
                
                let newInstructor = Instructor({
                    name,
                    email,
                    password: passwordHash,
                    username,
                    phone,
                    gender,
                    age,
                    subjects_handeled
                })
                let savedInstructor = await newInstructor.save()
                return res.json({status: 200, dataSaved : savedInstructor});
            }
            case 'student' : {
                const { name, email, password, username, phone, gender, age} = req.body;
                if(age < 18){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": "You should be 18+ to Register",
                        "param": "age"
                    })
                    return res.status(400).json(customErrors)
                }
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                let [getPhone,getUser] = await Promise.all([
                    Student.findOne({phone:phone}),
                    Student.findOne({username:username})
                ])
                if(getPhone && getPhone._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${phone} Mobile Number is already registered.`,
                        "param": "phone"
                    })
                    return res.status(200).json(customErrors)
                }
                if(getUser && getUser._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${username} is Already Taken.`,
                        "param": "phone"
                    })
                    return res.status(200).json(customErrors)
                }
                let newStudent = Student({
                    name,
                    email,
                    password: passwordHash,
                    username,
                    phone,
                    gender,
                    age
                })
                let savedStudent = await newStudent.save()
                return res.json({status: 200, dataSaved : savedStudent});
            }
            case 'subject' : {
                const { name, description ,created_by } = req.body;
                if(!description || !name){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": "Name or Description Cannot be Emtpy",
                        "param": "name/description"
                    })
                    return res.status(400).json(customErrors)
                }
                let [getSubject] = await Promise.all([
                    Subject.findOne({name:name}),
                ])
                if(getSubject && getSubject._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${name} : Subject already Exists.`,
                        "param": "name"
                    })
                    return res.status(400).json(customErrors)
                }
                
                let newSubject = Subject({
                    name,
                    description,
                    created_at : new Date().toISOString(),
                    created_by,
                    is_active : true
                })
                let savedSubject = await newSubject.save()
                return res.json({status: 200, dataSaved : savedSubject});
            }
            case 'course' : {
                const { name, description ,subjects_involved, created_by } = req.body;
                if(!description || !name){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": "Name or Description Cannot be Emtpy",
                        "param": "name/description"
                    })
                    return res.status(400).json(customErrors)
                }
                if(!Array.isArray(subjects_involved) || !subjects_involved.length){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": "Atleast One Subject should be Involved in a Course",
                        "param": "subjects_involved"
                    })
                    return res.status(400).json(customErrors)
                }
                let [getCourse] = await Promise.all([
                    Course.findOne({name:name}),
                ])
                if(getCourse && getCourse._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${name} : Course already Exists.`,
                        "param": "name"
                    })
                    return res.status(400).json(customErrors)
                }
                
                let newCourse = Course({
                    name,
                    description,
                    created_at : new Date().toISOString(),
                    created_by,
                    subjects_involved,
                    is_active : true
                })
                let savedCourse = await newCourse.save()
                return res.json({status: 200, dataSaved : savedCourse});
            } 
            case 'tag' : {
                const { name, description ,created_by } = req.body;
                if(!description || !name){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": "Name or Description Cannot be Emtpy",
                        "param": "name/description"
                    })
                    return res.status(400).json(customErrors)
                }
                let [getTag] = await Promise.all([
                    Tag.findOne({name:name})
                ])
                if(getTag && getTag._id){
                    customErrors.status = 400;
                    customErrors.errors.push({
                        "msg": `${name} : Tag already Exists.`,
                        "param": "name"
                    })
                    return res.status(400).json(customErrors)
                }
                let newTag = Tag({
                    name,
                    description,
                    created_at : new Date().toISOString(),
                    created_by,
                    is_active : true
                })
                let savedTag = await newTag.save()
                return res.json({status: 200, dataSaved : savedTag});
            }
            default : {
                return res.status(400).json({status: 400,message:`No entitys to add the Data`, entity : entity})
            }
        }
    }catch(e){
        console.error(`Error : POST : ${e}`)
        return res.status(400).json({status: 400,message:`Something Went Wrong`,errorMessage:e})
    }
})

router.post('/upload/:type',async (req, res) => {
    let video_type = req.params.type;
    let customErrors = {
        "status": 200,
        "errors": []
    }
    try{
        let uploadFailed = false;
        await upload.single('myFile')(req, res, async (err,result) => {
            let fileDetails = req.file;
            if (err instanceof multer.MulterError) {
                uploadFailed = true
            } else if (err) {
                uploadFailed = true
            }
            if(uploadFailed){
                customErrors.status = 500
                customErrors.errors.push({
                    "msg": `Something Went Wrong : ${JSON.stringify(err)}.`,
                })
                return res.status(200).json(customErrors)
            }else{
                const { title, description ,uploaded_by,tag,course,subject } = req.body;
                if(!video_type){
                    customErrors.status = 400
                    customErrors.errors.push({
                        "msg": "Type Cannot be Emtpy Video/Webinar",
                        "param": "name/description"
                    })
                    return res.status(200).json(customErrors)
                }
                if(!description || !title){
                    customErrors.status = 400
                    customErrors.errors.push({
                        "msg": "Name or Description Cannot be Emtpy",
                        "param": "name/description"
                    })
                    return res.status(200).json(customErrors)
                }
                let [getTitle] = await Promise.all([
                    Video.findOne({title:title,video_type:video_type})
                ])
                if(getTitle && getTitle._id){
                    customErrors.status = 400
                    customErrors.errors.push({
                        "msg": `Video/Webinar already Exists with title : ${title}.`,
                        "param": "name"
                    })
                    return res.status(200).json(customErrors)
                }
                let newVideo = Video({
                    title,
                    description,
                    file_name : fileDetails.filename,
                    path : fileDetails.path,
                    uploaded_at : new Date().toISOString(),
                    uploaded_by,
                    tag,
                    course,
                    subject,
                    video_type : video_type
                })
                let savedVideo = await newVideo.save();
                return res.json({status: 200, dataSaved : savedVideo});
            }
        })
    }catch(e){
        console.error(`Error : POST : ${e}`)
        customErrors.status = 500
        customErrors.errors.push({
            "msg": `Something Went Wrong : ${JSON.stringify(e)}.`,
        })
        return res.status(200).json(customErrors)
    }
})
module.exports = router;