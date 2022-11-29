const express = require('express');
const app= express()
var mongoose= require('mongoose');
const { env } = require('process');
app.use(express.urlencoded());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));
var fs = require('fs')
const keys = require("./keys");
const { mongoAdmin, mongoAdminPW, port, Tool } = require('./keys');
const { type, getPriority } = require('os');
const { throws } = require('assert');
const { json } = require('express');
const fsExtra = require('fs-extra');
require("tool.js");

server.listen(port, () => {
    console.log("listening on port " + port + "! :)");
  });

    //socket.io
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
      });
      io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });


      initiateParametercontent();

//main().catch(err => console.log(err));


app.use('/node_modules', express.static(__dirname+"/node_modules/"));

app.use("/",express.static(__dirname+"/src/html/"));
app.use("/leaflet-providers",express.static(__dirname+"/node_modules/leaflet-providers/leaflet-providers.js"))
app.use("/app", express.static(__dirname+"/build/"))
/*app.get("/app",(req,res)=>{
    req.send(res.sendFile(__dirname+"/build/html/index.html"))
})*/
app.get("/index",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })
app.get("/overview",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/overview.html")
    res.statusCode=200
    })
app.get("/",(req,res,next)=>{
    res.redirect("/index");
    })
app.get("/test",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/test.html")
    //res.sendStatus(200)
    })
app.get("/params",(req,res)=>{
    console.log("Parameterrequest:")
    console.log(parametercontent)
    res.redirect("/")
})
app.delete("/upload",(req,res)=>{
    console.log("incoming delete order",req.body)


    // data = TempTool.DB.content.findByIdAndUpdate(
        //req.body._id,{ "object": req.body.content,"_id":req.body._id},
        //{upsert: true,new: true,returnDocument:'after'},
    
    currentTool.DB.content.deleteOne({_id:req.body._id},(error,doc)=>{
        if(error!=null){
            console.log("error",error)
        }else{
            console.log("doc",doc);
            io.emit("delete",req.body);
        }
    })
    res.sendStatus(200);
})
app.get("/schema",(req,res)=>{
    console.log("schema requiest")
    currentTool.DB.DataDatadomainOperations.find({},(err,docs)=>{console.log("..sending schema..");res.send(docs)})
})
app.get("/download",(req,res)=>{
    currentTool.DB.content.find({}, function (err, docs) {
       // res.download(String(docs))
       var filename = 'user.json';
       var mimetype = 'application/json';
       res.setHeader('Content-Type', mimetype);
       res.setHeader('Content-disposition','attachment; filename='+filename);
       out="";

       for(x of docs){
        console.log(x)
        out+=JSON.stringify(JSON.parse(x.object))
       }
       res.send(out)
    })

})
app.get("/upload",(req,res)=>{
    currentTool.DB.content.find({}, function (err, docs) {res.send(docs)})
})
app.get("/history",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    currentTool.DB.history.find({"RealID":req.query._id}, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.get("/popup",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    currentTool.DB.DataInput.findById(req.query._id, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.post("/popup",(req,res)=>{
    console.log("Ab hier beginnt der most recent Test")
    console.log(req.body)//"_id":req.body._id,...req.body
    console.log("req.body._id",req.body._id)
    console.log(JSON.stringify(req.body))
    currentTool.DB.DataInput.findByIdAndUpdate(req.body._id,req.body,{upsert: true,new: true,returnDocument:'after'},
        (error, doc) => {
            if(error!=null){
            console.log("error",error)
        }else{
            console.log("doc",doc);
        }
        const count = currentTool.DB.history.countDocuments({RealID:req.body._id},(err,count)=>{
            console.log('there are %d entrys for id in history already', count);
            if(count==0){
                req.body.DomainOperations="Initialize"
            }
            currentTool.DB.history.create({RealID:req.body._id,version:count,DataDatadomainOperation:req.body.DomainOperations,value_post:req.body},{returnDocument:'after'},(error, doc) => {
                if(error!=null){
                console.log("error",error)
            }else{
                console.log("doc",doc);
            }
        });
        })
    })
    res.sendStatus(200);
})
app.post("/upload",(req,res)=>{
    console.log("/upload", req.body)
    data = currentTool.DB.content.findByIdAndUpdate(req.body._id,{ "object": req.body.content,"_id":req.body._id},{upsert: true,new: true,returnDocument:'after'},
    (error, doc) => {
         if(error!=null){
            console.log("error",error)
        }else{
            console.log("doc",doc);
            io.emit("update",doc);
        }
    })
    res.sendStatus(200)
    })
app.post("/",async(req,res)=>{
    console.log("Post incoming: ",req.body)
   res.redirect("/app/html")
    
    })