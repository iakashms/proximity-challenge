StudentdEntity => {
  "name" : "Akash",
  "email": "akash@gmail.com",
  "phone": 7836787676,
  "username": "akashms",
  "password": "123456",
  "gender":  "Male",
  "age": 27
}

SubjectdEntity => {
  "name" : "Maths",
  "description" : "Mathematics",
  "created_by" : ObjectID("60aa5516fe82c6470d11ebdf")
}

InstructordEntity => {
  "name": "Akash",
  "email": "akash@gmail.com",
  "phone": 7836787676,
  "username": "akashms",
  "password": "123456",
  "gender": "Male",
  "age": 27,
  "subjects_handeled": [
    "60aa58a021a0b54c9f2212fc",
    "60aa58d38bec1b4cd8d5f82c"
  ]
}

CoursedEntity => {
    "name": "BCA",
    "description": "Bachelor of Computer Applications",
    "subjects_involved": [
        "60aa58a021a0b54c9f2212fc",
        "60aa58d38bec1b4cd8d5f82c"
    ],
    "created_by": "60aa5a20c3bf084fc48dc81c"
}

TagdEntity => {
    "name": "Education",
    "description": "Education Related Videos",
    "created_by": "60aa5a20c3bf084fc48dc81c"
}

VideodEntity =>
{
    "title": "Data Structures - Part 2",
    "description": "Video on Data Structures and Algorithms",
    "uploaded_by": "60aa5ec6880d1a5af57eb1a3",
    "tag": "60aa610ac0516c5e24c89e69",
    "course": "60aa5c8259f3ce564f78bcc4",
    "subject": "60aa58a021a0b54c9f2212fc"
}