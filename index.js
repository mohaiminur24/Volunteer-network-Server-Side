const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// midelwere is here
app.use(cors());
app.use(express.json());



// MongoDB connection is start here

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.85env82.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // connection with database is here
    const db_event = client.db('VolunteerNetwork').collection('event');
    const db_volunteer = client.db('VolunteerNetwork').collection('volunteer');


    // All route is here

    

    // get volunteer list route is here
    app.get("/volunteerlist", async(req,res)=>{
        try {
          const result = await db_volunteer.find().toArray();
          res.send(result);
        } catch (error) {
          console.log(error);
        }
    });

    // get all event route is here
    app.get("/allevent", async(req, res)=>{
      try {
        const result = await db_event.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get user all event route is here
    app.get("/userevent",async(req, res)=>{
      try {
        const useremail = req.query.email;
        const query = {"userEmail": useremail};
        const result = await db_event.find(query).toArray();
        res.send(result);

      } catch (error) {
        console.log(error);
      }
    });

    // search event route is here
    app.get("/searchevent", async(req,res)=>{
        const searchtext = req.query.search;
        const query = { title:{$regex: searchtext, $options: 'i'}}
        const result = await db_event.find(query).toArray();
        res.send(result);
    })

    // new event add in database route is here
    app.post("/addevent",async(req,res)=>{
      try {  
          const event = req.body;
          const result = await db_event.insertOne(event);
          res.send(result);

      } catch (error) {
          console.log(error);
      }
    });

  // create new volunteer route is here
  app.post("/newvolunteer",async(req,res)=>{
    try {
      const volunteer = req.body;
      const result = await db_volunteer.insertOne(volunteer); 
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  });


  // Delete single event route is here
    app.delete("/delevent", async(req,res)=>{
      try {
        const id = req.query.id;
        const query = {_id: new ObjectId(id)};
        const result = await db_event.deleteOne(query);
        res.send(result);   

      } catch (error) {
        console.log(error);
      }
    });

  // Delete single volunteer route is here
    app.delete("/deleVolunteer", async(req,res)=>{
      try {
        const id = req.query.id;
        const query = {_id: new ObjectId(id)};
        const result = await db_volunteer.deleteOne(query);
        res.send(result);   

      } catch (error) {
        console.log(error);
      }
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Route is here
app.get("/",(req,res)=>{
    res.send("Volunteer Server is running perfectly!");
});

// app listen is here
app.listen(port, ()=>{
    console.log(`Volunteer server is running with ${port}`)
});

