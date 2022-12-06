const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app=express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware
app.use(cors());
app.use(express.json());

//mongodb start


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksontsm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const studentsCollections=client.db('online-notice-board').collection('students');
        const teachersCollections=client.db('online-notice-board').collection('teachers');
        const noticessCollections=client.db('online-notice-board').collection('notices');

        app.get('/students',async(req,res)=>{
            const query={}
            const result=await studentsCollections.find(query).toArray();
            res.send(result);
        });
        app.get('/students/:email',async(req,res)=>{
            const email=req.params.email;
    const filter={email:email};
    const result=await studentsCollections.findOne(filter);
    res.send(result);
        });
        app.post('/students',async(req,res)=>{
            const student=req.body;
            const result=await studentsCollections.insertOne(student);
            res.send(result);
        });
        app.get('/teachers',async(req,res)=>{
            const query={}
            const result=await teachersCollections.find(query).toArray();
            res.send(result);
        });
        app.get('/teachers/:email',async(req,res)=>{
            const email=req.params.email;
    const filter={email:email};
    const result=await teachersCollections.findOne(filter);
    res.send(result);
        });
        app.post('/teachers',async(req,res)=>{
            const teacher=req.body;
            const result=await teachersCollections.insertOne(teacher);
            res.send(result);
        });
        app.get('/notices',async(req,res)=>{
            const email=req.query.email;
            let filter={};
            if(email){
               filter={teacher_email:email};
            }
            
    
    const result=await noticessCollections.find(filter).toArray();
    res.send(result);
        });
        app.get('/allNotices',async(req,res)=>{
            const session=req.query.session;
            const section=req.query.section;
            const department=req.query.department;

            // const filter={
            //     session:session ,  
            //     section:section,
            //     department:department,
                
            // };
            // console.log(filter);
            
    
    const result=await noticessCollections.find({
      $or:[
        {session:session,section:section,department:department},
        {session:session,section:'To All',department:department},
        {session:session,section:'To All',department:'To All'},
        {session:'To All',section:'To All',department:department},
        {session:'To All',section:'To All',department:'To All'},
        
      ]
    }).toArray();
    res.send(result);
        });
        app.post('/notices',async(req,res)=>{
            const notice=req.body;
            const result=await noticessCollections.insertOne(notice);
            res.send(result);
        });
        app.delete('/notices/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id: ObjectId(id)};
            const result=await noticessCollections.deleteOne(filter);
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(console.log)
//mongodb end

app.get('/',async(req,res)=>{
    res.send('Online Notice Board Server')
})
app.listen(port,()=>{
    console.log(`Online Notice Board are running on server ${port}`);
})