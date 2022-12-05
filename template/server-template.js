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
const { mongoAdmin, mongoAdminPW, params } = require('./keys');
const { type, getPriority } = require('os');
const { throws } = require('assert');
const { json } = require('express');
const fsExtra = require('fs-extra');
server.listen(3000, () => {
    console.log("listening on port " + 3000 + "! :)");
  });
  currentTool=new Tool(params)

  sleep(3000);
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

      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
//main().catch(err => console.log(err));


app.use('/node_modules', express.static(__dirname+"/node_modules/"));

app.use("/",express.static(__dirname+"/html/"));
app.use("/leaflet-providers",express.static(__dirname+"/node_modules/leaflet-providers/leaflet-providers.js"))
app.use("/app", express.static(__dirname+"/build/"))
/*app.get("/app",(req,res)=>{
    req.send(res.sendFile(__dirname+"/build/html/index.html"))
})*/
app.get("/index",(req,res,next)=>{
    res.sendFile(__dirname+"/html/index.html")
    })
app.get("/",(req,res,next)=>{
    console.log("get")
    res.redirect("/index");
    })
app.get("/test",(req,res,next)=>{
    res.sendFile(__dirname+"/html/test.html")
    //res.sendStatus(200)
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
    function Tool(param){
        this.name=param.ToolName;
        this.param=param;
        this.Schema=function Schema(input){
            input=input.replace(/ /g,"").split(";");
            input = [...new Set(input)] //only unique values
            return input;
        }
        this.JsonFromString=function JsonFromString(input){

            input=input.replace(/ /g,"").replace(/,/g,'","').replace(/:/g,'":"').replace(/[\r\n]/g, "");
            input='{"'+input+'"}'
            output = JSON.parse(input)
            output["_id"]=String
            for(x in output){
                switch(output[x]){
                    case "Number":
                    case "number":
                        output[x]=Number
                        break;
                    case "String":
                    case "string":
                        output[x]=String
                        break;
                    case "Boolean":
                    case "boolean":
                        output[x]=Boolean
                        break;
                }
                console.log("JsonFromString x:"+x,output[x])
            }
            console.log("JsonFromString:"+output)
            return output
        }

        this.schema=this.Schema(param.schema);
        this.DataTypeInput=this.JsonFromString(param.DataTypeInput);
        this.content=param.content;
        this.DB={}
        this.DB.content={};
        this.DB.history={};
        this.DB.DataDatadomainOperations={};
        this.DB.DataInput={};
        this.EtablishConnection= async function EtablishConnection(){
            //var conn= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: this.name},(err)=>{
            var conn= mongoose.createConnection('mongodb://@mongo:27017/',{dbName: this.name},(err)=>{

            if(err)console.log(err)    
            console.log("Mongoose Connection to "+this.name+" successful")
            })
            const contentSchema = new mongoose.Schema({
                _id: Number,
                "object": String
            });
            const historySchema = new mongoose.Schema({
                RealID:Number,
                version: Number,
                DataDatadomainOperation: String,
                value_post: Array 
            })
            const domainoperationsSchema = new mongoose.Schema({
                wert: String
            })
            this.DB.content=conn.model("content",contentSchema);
            this.DB.history=conn.model("history",historySchema);
            this.DB.DataDatadomainOperations=conn.model("domainOperations",domainoperationsSchema);
            if(this.schema.length>1){
                for (x of this.schema) {//Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
                    this.DB.DataDatadomainOperations.findOneAndUpdate({"wert":x},{"wert":x},{upsert: true,new: true},(err,docs)=>{console.log("DDO anlegen",err,docs)})
                }
            }else{
                this.DB.DataDatadomainOperations.findOneAndUpdate({"wert":this.schema[0]},{"wert":this.schema[0]},{upsert: true,new: true},(err,docs)=>{console.log("DDO anlegen",err,docs)})
            }
            if(this.DataTypeInput.length<=1){
                console.log("DataTypeInput kleinergleich 1")
            }else{
                    const DataInputSchema = new mongoose.Schema(
                    this.DataTypeInput)
            this.DB.DataInput=conn.model("Data",DataInputSchema);
            this.DB.DataInput.log=()=>{
                output="";
                LocalDTI=this.DataTypeInput;
                LocalDTI["_id"]=String;
                for(x in LocalDTI){
                    output=x+":"+this.LocalDTI[x].name+"\n"
                }
                return output;
            }
            }
        }
        this.getDataKeys=function(){
            output=[]; i=0;
            for (x in this.DataTypeInput){
                output[i]=x;
                i++;
            }
            //console.log(this.name+".getDataKeys() :"+output)
            return output
        }
        console.log("DataInput Schema:")
        for(x in this.DataTypeInput){
            console.log(x+":"+this.DataTypeInput[x].name)
        }
        this.EtablishConnection();


    }
process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})

