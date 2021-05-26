# proximity-challenge
Rest API where an instructor and student manage their Webinars &amp; Courses


Open your cmd

Clone this Repostiroty -> git clone git@github.com:iakashms/proximity-challenge.git

go inside the cloned Repo

do -> npm install (this will install all the dependencies in your local system)


 1.Architectural overview 
    Browser
      |
  User Interface
      |
   NodeJS (Backend)
      |
   Database
  
  for Diagram : https://ibb.co/Wf23Gvq
      

2. Tools and technologies you used
Framework : Express
Libraries : mongoose, bodyParser, multer
DB : MongoDB
ENV : NodeJS

3. What you think can be improved and how?
Optimization for Video storage, currently using local storage, can implement in s3 and access it via url

API Details

Method Accepted : GET, POST, PATCH
Api Response : json

1. Save Records in DB - POST
Method : POST 
URL : http://localhost:6000/api/v1/:entity
entity => student,instructor,tag,course,subject

This API takes All post request for the entities mentioned above, this will create a record in DB, with some checks 

Sample 1 : Student entity
curl --location --request POST 'http://localhost:6000/api/v1/student' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Akash",
    "email": "akash@gmail.com",
    "phone": 7836787676,
    "username": "akashms",
    "password": "123456",
    "gender": "Male",
    "age": 27
}'

Success Message => {
    "status": 200,
    "dataSaved": {
        "_id": "60acf8d84ef2dc338d0d013d",
        "name": "Akash Kumar",
        "email": "akash@gmail.com",
        "password": "$2a$10$lC1S/FAeFmTkvgjkiXINB.kij2oIZtIGvomB0Eum/rm0ug6EbY8qu",
        "username": "akashkumar",
        "phone": 7836557676,
        "gender": "Male",
        "age": 27,
        "__v": 0
    }
}

Error Message => {
{
    "status": 400,
    "errors": [
        {
            "msg": "7836787676 Mobile Number is already registered.",
            "param": "phone"
        }
    ]
}


Sample 2 : tag entity
curl --location --request POST 'http://localhost:6000/api/v1/tag' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Education",
    "description": "Education Related Videos",
    "created_by": "60aa5a20c3bf084fc48dc81c"
}'

Success Message => {
    "status": 200,
    "dataSaved": {
        "_id": "60acf92e4ef2dc338d0d013e",
        "name": "Programming",
        "description": "Programming Related Videos",
        "created_at": "2021-05-25T13:18:38.812Z",
        "created_by": "60aa5a20c3bf084fc48dc81c",
        "is_active": true,
        "__v": 0
    }
}

Error Message => {
    "status": 400,
    "errors": [
        {
            "msg": "Education : Tag already Exists.",
            "param": "name"
        }
    ]
}


----------------------------------------------------------


2. GET Records from DB

Method : GET
URL : http://localhost:6000/api/:entity
URL : http://localhost:6000/api/:entity/:Id

Entites => ['subject','course','tag'] => with default search condition is_active : true

GET http://localhost:6000/api/v1/tag?query={"created_by":"60aa5a20c3bf084fc48dc81c"}&select={"name":1,"description":1}
GET http://localhost:6000/api/v1/subject?populate=["created_by"]

GET http://localhost:6000/api/v1/video?query={"video_type":"webinar","subject":"60aa58a021a0b54c9f2212fc","course":"60aa5c8259f3ce564f78bcc4"}
GET http://localhost:6000/api/v1/video?query={"video_type":"webinar"}&select={"title":1,"description":1}
GET http://localhost:6000/api/v1/video?query={"video_type":{"$in":["webinar","video"]}}&populate=["subject","uploaded_by"]

GET http://localhost:6000/api/v1/subject/60aa58fa8bec1b4cd8d5f82e

-----------------------------------------------------------

3. Update or Deleted Records : PATCH
To Update the Records
Method : PATCH
URL : http://localhost:6000/api/v1/:entity/:Id

PATCH is used for updating the records,

For deleting the record from ['subject','course','tag'], updating is_active : false, so that it will be considered as deleted

curl --location --request PATCH 'http://localhost:6000/api/v1/subject/60aa58fa8bec1b4cd8d5f82e' \
--header 'Content-Type: application/json' \
--data-raw '{
    "created_at": "2021-05-25T13:30:34.286Z",
    "is_active": true,
    "__v": 0
}'


--------------------------------------------------------------
API to upload the Video/Webinar

Method : POST 
URL : http://localhost:6000/api/v1/upload/:type
entity => video

This API will accept form-data

curl --location --request POST 'http://localhost:6000/api/v1/upload/video' \
--form 'myFile=@"/home/akash/Videos/NgRock.mp4"' \
--form 'title="Science"' \
--form 'description="Science"' \
--form 'uploaded_by="60aa5ec6880d1a5af57eb1a3"' \
--form 'tag="60aa610ac0516c5e24c89e69"' \
--form 'course="60aa5c8259f3ce564f78bcc4"' \
--form 'subject="60aa58a021a0b54c9f2212fc"'


Success Message => {
    "status": 200,
    "dataSaved": {
        "_id": "60ad06ff54161f4f26bf2cc0",
        "title": "Science",
        "description": "Science",
        "file_name": "myFile-1621952255485-871887406",
        "path": "my-uploads/myFile-1621952255485-871887406",
        "uploaded_at": "2021-05-25T14:17:35.710Z",
        "uploaded_by": "60aa5ec6880d1a5af57eb1a3",
        "tag": "60aa610ac0516c5e24c89e69",
        "course": "60aa5c8259f3ce564f78bcc4",
        "subject": "60aa58a021a0b54c9f2212fc",
        "video_type": "video",
        "__v": 0
    }
}

Error Message => {
    "status": 400,
    "errors": [
        {
            "msg": "Video/Webinar already Exists with title : Science.",
            "param": "name"
        }
    ]
}
