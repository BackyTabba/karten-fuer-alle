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
const { mongoAdmin, mongoAdminPW } = require('./keys');
const { type, getPriority } = require('os');
const { throws } = require('assert');
const { json } = require('express');
const fsExtra = require('fs-extra');
const SSH = require('simple-ssh');

//const mkdirp =require('mkdirp');


//https://github.com/MCluck90/simple-ssh#readme
//read env/cert
SSHkey="";
fs.readFile("env/KartenFuerAlle.ppk", 'utf8', function(err, data) {
    if (err){console.log("no certificat found")};
//open ssh key
console.log(data)
SSHkey=data;

})




var port=3000
server.listen(port, () => {
    console.log("listening on port " + port + "! :)");
  });

//Database
countNumber=0;


var conntection= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: "Tool"},()=>{console.log("Mongoose Connection to Tools successful")})   
const toolHistorySchema = new mongoose.Schema({
    countNumber: Number,
    name: String,
    tool: Array 
})
toolHistory=conntection.model("Tool",toolHistorySchema);
/*
//https://stackoverflow.com/questions/19751420/mongoosejs-how-to-find-the-element-with-the-maximum-value
toolHistory.find({}).sort({score : -1}).limit(1).exec((err,data)=>{
    console.log("toolHistory countNumber: err",err,"data",data)
    console.log(data[0].countNumber)
    if(data[0].countNumber>=0){
        countNumber=data[0].countNumber+1;
}});*/

// find the max countNumber of all Tools
toolHistory.aggregate(
    [{ $group: { _id: null, maxCountNumber: { $max: '$countNumber' }}}
  , { $project: { _id: 0, maxCountNumber: 1 }}]
  , function (err, res) {
  if (err) return handleError(err);
  console.log(res); // [ { maxCountNumber: 2 } ]
  countNumber=res[0].maxCountNumber
  console.log("countNumber",countNumber)
  toolHistory.find({countNumber:countNumber},null,(err,doc)=>{
    console.log(doc)
    console.log(doc[0].tool[0])
    currentTool=new Tool(doc[0].tool[0])
})
  
});


sleep(2000);

//--Database

/*
fs.rm("\\build", { recursive: true, force: true },()=>{
    console.log("Deleted build, recreating")
    fs.mkdir("\\build",()=>{
        console.log("created build")
        fs.mkdir("\\build/html",(err)=>{
            if(err) console.log(err)
            console.log("build/html created")
            
        })
    })
});*/
fsExtra.emptyDir("build").then(()=>{
fsExtra.ensureDir("build/html")
.then(() => {
  console.log('success!')
  fsExtra.emptyDir("build/html");
})
.catch(err => {
  console.error(err)
})})


        //https://github.com/nodejs/node/issues/17921 !!!!!!!!!!!!!!!!

//const made = mkdirp.sync('\\build\\html')




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

//Docker compose auf aws
 // https://stackoverflow.com/a/64433194/20492957

 //Docker compose auf aws
//https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html



//portmanagement
//initial
var ports=[];
var startingport=3001;
var portcount=1;
ports.add=function(tool){

    if(ports.length==portcount){ //ports volle länge, also erstes element löschen
        del=ports.shift()
        console.log(del.tool.name+" is removed from Ports")
    }
    ports.push({"tool":tool,"port":startingport+ports.length*10})
    return ports[ports.length]
    //push mounting tool
}
ports.getPort= function (tool){
    console.log(ports)
    for(x of ports){
        if (x.tool.name==tool.name){
            return x.port;
        }
    }
    return null;
}


/*var morgan = require('mongoose-morgan');

//todo Morgan vernünftig zum Laufen bringen
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
    })
morgan.format('myformat', ':date[Europe/Germany] | :method | :url | :response-time ms');*/
//app.use(morgan('myformat'))

//Variablendeklaration
filename = __dirname+"/src/html/input.txt";
var content, history, domainOperations;
var parametercontent={}
var parameterorder=["start","Polygon","Marker","Rectangle","Circle","Polyline","OpenStreetMap","CartoDB.Positron","CartoDB.DarkMatter","CartoDB.Voyager","OpenStreetMap.Mapnik","OpenTopoMap","Stadia.AlidadeSmoothDark","Stadia.OSMBright","Esri.WorldImagery","open","save","end"]

/*var incomingCall={
    ToolName: 'Template',
    content: {
      start: 'true',
      actions: {
        Polygon: 'true',
        Marker: 'true',
        Rectangle: 'true',
        Circle: 'true',
        Polyline: 'true'
      },
      end: 'true',
      open: 'true',
      save: 'true',
      end2: 'true'
    },
    schema: 'Asave;Bsave;Csave;Dsave',
    DataTypeInput:'Attribute1:String,\r\nAttributBeispiel:Number,\r\nAttribute1245:Boolean'
  }
  TempTool= new Tool(incomingCall)*/



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

app.get("/testSSH",(req,res)=>{

})
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
    /*var user = {"name":"azraq","country":"egypt"};
    var json = JSON.stringify(user);
    var filename = 'user.json';
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( json );*/

})
app.get("/upload",(req,res)=>{
    temp=""
    //TempTool.EtablishConnection();
    currentTool.DB.content.find({}, function (err, docs) {
        //console.log(docs)
        temp=docs
        currentTool.DB.DataInput.find({},function(err,docs){
            console.log(Array.isArray(temp))
            console.log(temp[0])
            console.log(docs[0])
            for (let index = 0; index < temp.length; index++) {
                temp[index]._id;
                let result = docs.filter(obj => {
                    return obj._id == temp[index]._id;
                  })
                //delete result._id
                //delete result.__v
                //console.log(result)
                //temp[index].object=JSON.parse(temp[index].object).properties={...temp[index].object.properties,...result}
                //console.log("json parse",JSON.parse(temp[index].object).properties)
                //JSON.parse(temp[index].object).properties
                //console.log("json parse new object",{})
                tempresult={}
                for(x of result){
                    //console.log(x)
                    tempresult=JSON.parse(JSON.stringify(x))
                    delete tempresult._id
                    delete tempresult.__v
                }
                TempObject=JSON.parse(temp[index].object)
                TempObject.properties={...TempObject.properties,...tempresult}
                console.log(TempObject)
                temp[index].object=JSON.stringify(TempObject)

            }   
            res.send(temp)
            //console.log(docs)
        })
        
    })

    //console.log(data)
    //res.send(data);
})
app.get("/history",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    //console.log("/popup req.body:",req)
    currentTool.DB.history.find({"RealID":req.query._id}, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.get("/popup",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    //console.log("/popup req.body:",req)

    currentTool.DB.DataInput.findById(req.query._id, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.post("/popup",(req,res)=>{
    console.log("Ab hier beginnt der most recent Test")
    console.log(req.body)//"_id":req.body._id,...req.body
    console.log("req.body._id",req.body._id)
    //console.log(TempTool.DB.DataInput.log())
    console.log(JSON.stringify(req.body))
    temp=""
    currentTool.DB.DataInput.findByIdAndUpdate(req.body._id,req.body,{upsert: true,new: true,returnDocument:'after'},
        (error, doc) => {
            console.log("doc",doc);
            temp=doc
        

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
        res.status(200).send(temp);
    })
    //
    //res.set("Connection", "close");
})

app.post("/upload",(req,res)=>{
    console.log("/upload", req.body)
    /*console.log("Upload incoming: ",req.body)
    console.log(TempTool.DB.content.inspect());
    console.log({ "content": req.body.content,"_id":req.body._id })*/
    //Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
    //Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
    //console.log(req.body)
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
    //console.log(doc)
    //io.emit("update","someData");
    //content.create({ "content": req.body.content,"_id":133245 }, (error, doc) => { console.log("error",error)

    
        /*Tank.create({ size: 'small' }, function (err, small) {
            if (err) return handleError(err);
            // saved!
        });/*
        // doc.children[0]._id will be undefined*/
    //  })
    
    })

app.post("/",async(req,res)=>{
    console.log("Post incoming: ",req.body)
    currentTool=new Tool(req.body);
    console.log("currentTool.name",currentTool.name)
    /*toolHistory.find({},(doc,err)=>{
        console.log("doc",doc,"error",err,err.name)
        if(err){
            console.log("error",err)
        }else{
            console.log("doc",doc);
            if(doc=={}) console.log("doc=={}")
        }
    })*/
    //console.log({name:currentTool.name,countNumber:countNumber,tool:{"name":currentTool.name,"schema":currentTool.schema,"DataTypeInput":currentTool.DataTypeInput,"content":currentTool.content}});
   // const doc = new User({ email: 'bill@microsoft.com' });
//await doc.save();
    
    toolHistory.create({"name":currentTool.name,"countNumber":++countNumber,"tool":[currentTool.param]},(doc,error)=>{
            console.log(error._doc)
            console.log("Tool "+currentTool.name+" created in DB");
    })
    //currentTool.EtablishConnection();
    //save(req.body.content)
    //res.send(currentTool.createOutputHTML())
    /*res.send("<html> <form action=\"/output.html\">"
    +"<input type=\"submit\" value=\"Vorschau\" /></form>")*/
    //res.sendFile(__dirname+"/src/html/test.html")
    await sleep(3000);
    //res.send(currentTool.createOutputHTML())
    //res.sendFile(__dirname+"/build/html/index.html")
   // console.log("sendfile /build/html/index.html")
   res.redirect("/app/html")
    
    })
app.get("/abba",(req,res)=>{ 
    GenerateTool({},currentTool)
    sleep(3000)
    CreateImage(SSHkey)
    res.send(JSON.parse(JSON.stringify(currentTool)))
    //JsonFromString();
    //console.log(currentTool.getPopupString())
    //res.send(currentTool.getPopupString())
})

//DB-Routen


/**
 * Schreibt Inhalte in die Variable parametercontent aus der Inputdatei (Speicherort definiert in der Variable "filename")
 */
function initiateParametercontent(){
    //fs.unlinkSync(filename);
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        //Findet Marker nach dem Schema //$Marker$
        matches=[...data.matchAll(/\/\/\$(.*)\$/gm)]
        cfg=matches[1][1]
        data=data+"\r\n"
        //Setzt die Länge des Inhalts des Markers
        for(i=0;i<matches.length;i++){
            if(i+1>=matches.length){
                contentLength=data.length
            }else{
                contentLength=matches[i+1].index
            }
            //Sliced matches auf das Format {Markername:  Inhalt des Markers} und speichert es in parametercontent
            //Hilfreich https://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
            parametercontent={...parametercontent,[matches[i][1]]:data.slice(matches[i].index+matches[i][0].length+2,contentLength)}
        }
      });
}
/**
 * Schlägt die Werte der Variable param in parametercontent nach und schreibt die Inhalte in eine Datei
 * @param {*} param 
 */
function save(param){
        //neue Datei anlegen und Auswahl reinkopieren
        output=""
       /* for (x of param) { //Fängt manche Fehler bei der Übermittlung ab, param stammt mehr oder weniger direkt aus der HTML-Auswahldatei. Schreibt, falls alles in Ordnung (String), den String direkt in Output
            if (parametercontent[x]!=undefined&&typeof(x)=="string"){
                output+=parametercontent[x]
            }
            if(typeof(param[x])=="object"){ //Falls param ein Objekt enthält (=select-Feld in index.html)
                i=0;
                for (y of param[x]){ //Jeden String des Objekts nachschlagen und an output anhängen
                    if (parametercontent[y]!=undefined&&typeof(y)=="string"){
                        output+=parametercontent[y]
                    }
                    if(i<param[x].length-1){
                        output+=","
                    }
                    i++;
                }
            }
        }*/
        for(x of parameterorder){
           // console.log('param['+x+']=="true"',param[x]=="true",typeof(x),x)
            if(param[x]=="true"){
                //output+=parametercontent[x]
                //console.log(x,typeof(x))
                output+=parametercontent[x]
            }
            if(x instanceof Object){ //Falls parameterorder ein Objekt enthält
                i=0;
                for (y of x){ //Jeden String des Objekts nachschlagen und an output anhängen
                    //schönere Variante mit Iterator umsetzen? https://robdodson.me/posts/javascript-design-patterns-iterator/
                    if (y!=undefined&&typeof(y)=="string"&&param.actions[y]=="true"){//unschön weil actions vorgegeben werden muss, da array mit object verglichen wird und das object einen namen hat, den das array nicht kennen kann
                        output+=parametercontent[y]
                    }
                    if(i<Object.keys(param.actions).length-1){
                        output+=","
                    }
                    i++;
                }
            }
        }
       // console.log(parametercontent)

        fs.writeFile('src\\html\\output.html', output, function (err) {
            if (err) throw err;
            console.log('Saved output.html!');
            });
}
function Tool(param){
    this.name=param.ToolName;
    this.param=param;
    this.schema=Schema(param.schema);
    this.DataTypeInput=JsonFromString(param.DataTypeInput);
   // console.log(this.schema)
    this.content=param.content;
    this.DB={}
    this.DB.content={};
    this.DB.history={};
    this.DB.DataDatadomainOperations={};
    this.OutputHTML="";
    this.createOutputHTML= function(...args){
        output=""
        this.outputString=output;
        //console.log(parametercontent)
        //console.log()
        for(x of parameterorder){ // parameterorder=["start",["Polygon","Marker","Rectangle","Circle","Polyline"],"end","open","save","end2"]
           // console.log("Tool createOutputHTML Aktueller Parameter "+x, "this.content[x]",this.content[x], 'this.content[x]=="true"',this.content[x]=="true")
            if(this.content[x]=="true"){
                 output+=parametercontent[x]
             }
             if(x instanceof Object){ //Falls parameterorder ein Objekt enthält aka ["Polygon","Marker","Rectangle","Circle","Polyline"]
                console.log("instance of Object")
                 for (y of x){ //Jeden String des Objekts nachschlagen und an output anhängen
                    //schönere Variante mit Iterator umsetzen? https://robdodson.me/posts/javascript-design-patterns-iterator/
                     /*if (y!=undefined&&typeof(y)=="string"&&this.content.actions[y]=="true"){ //unschön weil actions vorgegeben werden muss, da array mit object verglichen wird und das object einen namen hat, den das array nicht kennen kann
                         output+=parametercontent[y]
                     }
                     if(i<Object.keys(this.content.actions).length-1){
                         output+=","
                     }
                     i++;*/
                     if (y!=undefined&&typeof(y)=="string"&&this.content.actions[y]=="true"){
                     //console.log("zweite if schleife)output+=")
                    }
                 }
             }
         }
         this.OutputHTML=output;
         return output;
    }
    this.CreateEnvVars=function(){
        var data="ToolName=\'"+this.name+"\'\n"
        data+="PopupString=\'"+this.getPopupString()+"\'"
    
        write('./build/html/envVars.js', data, "Saved build/envVars.js!");
    }
    this.CreateOutputHtmlFile=async function(){
        if(this.OutputHTML==""){
            this.createOutputHTML()
        }
        write('./build/html/index.html',this.OutputHTML,"Saved build/index.html");
        /*fs.writeFile('/build\\html\\index.html',this.OutputHTML , function (err) {
            if (err) throw err;
            console.log('Saved output.html!');
            });*/
    }
    this.CopyEssentials=function(){

        //func.js
    fs.readFile("src/html/func.js", 'utf8', function(err, data) {
        if (err) throw err;
                write('./build/html/func.js', data,"Saved build/html/func.js!")             
                /*fs.writeFile('/build\\html\\func.js', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build\\html\\func.js!');
                    });*/
      });
      //ColorPicker.js
      fs.readFile("src/html/ColorPicker.js", 'utf8', function(err, data) {
        if (err) throw err;                
                fs.writeFile('./build/html/ColorPicker.js', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build/html/ColorPicker.js!');
                    });
      });
      //style.css
      fs.readFile("src/html/style.css", 'utf8', function(err, data) {
        if (err) throw err;                
                fs.writeFile('./build/html/style.css', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build/html/style.css!');
                    });
      });
    }
    this.save=function(){
        this.CopyEssentials();
        this.CreateOutputHtmlFile();
        this.CreateEnvVars();
    }
    this.EtablishConnection= async function EtablishConnection(){
        let name=this.name;
        console.log("mongodb://"+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/,{dbName: '+this.name+'}')
        var conn= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: this.name},(err)=>{console.log("EtablishConnection mongoose.createConnection: "+err)})
        conn.on("connected", function(name){
            console.log("EtablishConnection: Mongoose Connection to "+name+" successful");
        });
        
        conn.on("error", function(err,name){
            console.log("EtablishConnection: Mongoose Connection to "+name+" error: " + err);
        });
        
        conn.on("disconnected", function(name){
            console.log("EtablishConnection: Mongoose Connection to "+name+" disconnected ");
        });
        
        //await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: Tool.name}).then(()=>{console.log("Mongoose Connection to "+Tool.name+" successful")});
        
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
        //console.log(this.schema)
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
           // for(x in this.DataTypeInput){
              //  DataTypeInput[x] //String,Number,Boolean
                const DataInputSchema = new mongoose.Schema(/*{
                    _id: Number,
                    werte: String,
                    value_pre: String,
                    value_post: String
                }*/this.DataTypeInput)          
          //  }
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
    this.getCreationPopupString=()=>{
        outputstr='<form action="/popup" method="POST" id="take"> \n     <fieldset>\n'
        console.log("getCreationPopupString().getDataKeys(): ",this.getDataKeys())
        for (x of this.getDataKeys()){
            validationPattern="";
            title="";
            console.log("getCreationPopupString() this.DataTypeInput[x].name:",this.DataTypeInput[x].name)
            switch(this.DataTypeInput[x].name){
                case "String": validationPattern='"^.*$"'; title="Ab-cDe.F54,2sg"; break
                case "Number": validationPattern='"^\\d*(.|,)?\\d*$"'; title="133245553.055 \| 113124 \| 1151515,04"; break
                case "Boolean": validationPattern='"^(True|true|False|false)$"'; title="True \| False"; break
                default : console.log("getCreationPopupString(): Kein vailidationPattern passt..."); validationPattern="^.*$"; break
            }
           // console.log("getCreationPopupString() nach Ermittlung des validation Patterns: ",outputstr, validationPattern,title)
            outputstr+='<div><label for="'+x+'">'+x+'</label><input type="text" id="'+x+'" name="'+x+'" value="" required pattern='+validationPattern+' title="'+title+'"></div> \n'
        }
        outputstr+='</select>\n '
        outputstr+='<input type="text" id="_id" name="_id" value=${value} hidden=true>'
        outputstr+='<input type="submit" value="Senden"></div>'
       return outputstr+='</fieldset>\n</form>';
    }
    this.getPopupString=()=>{
        outputstr='<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>\\n        <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>\\n        <script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>\\n        <form action="/popup" method="POST" id="take"> \\n     <fieldset>\\n'
        console.log("getPopupString().getDataKeys(): ",this.getDataKeys())
        for (x of this.getDataKeys()){
            validationPattern="";
            title="";
            //console.log("getPopupString() this.DataTypeInput[x].name:",this.DataTypeInput[x].name)
                if(x!=="_id"){
                switch(this.DataTypeInput[x].name){
                    case "String": validationPattern='"^.*$"'; title="Ab-cDe.F54,2sg"; break
                    case "Number": validationPattern='"^\\\\d*(.|,)?\\\\d*$"'; title="133245553.055 \| 113124 \| 1151515,04"; break
                    case "Boolean": validationPattern='"^(true|false)$"'; title="true \| false"; break
                    default : console.log("getPopupString(): Kein vailidationPattern passt..."); validationPattern="^.*$"; break
                }
                //console.log("getPopupString() nach Ermittlung des validation Patterns: ",outputstr, validationPattern,title)
                outputstr+='<div><label for="'+x+'">'+x+'</label><input type="text" id="'+x+'" name="'+x+'" value="" required pattern='+validationPattern+' title="'+title+'"></div> \\n'
                }
            }

        //Select
        //console.log(this.schema)
        outputstr+='<div><select name="DomainOperations" id="DomainOperations">\\n'
        for(x of this.schema){
                outputstr+='"<option value="'+x+'">'+x+'</option>+\\n'

        }
        outputstr+='</select>\\n '
        outputstr+='<input type="text" id="_id" name="_id" hidden="true" value=${value}>'
        outputstr+='<input type="submit" value="Senden">'
        outputstr+=' <div hidden="true" name="Message" id="Message">Refreshing...</div>'
        outputstr+=' <div style="color:green" hidden="true" name="SubmitSuccess" id="SubmitSuccess">Success</div>'
       outputstr+='</fieldset>\\n</form>';
       outputstr+='<div><label for="history">Objekthistorie</label></div>'
       outputstr+='<textarea id="history" name="history rows="6" cols="20"></textarea>'
       
       
       



       return outputstr;
    }

    this.save();
    this.EtablishConnection();
}


//ID= drawnItems.getLayerId(drawnItems.getLayers()[0])
async function EtablishConnection(Tool){
    var conn= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: Tool.name},()=>{console.log("Mongoose Connection to "+Tool.name+" successful")})
    //await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: Tool.name}).then(()=>{console.log("Mongoose Connection to "+Tool.name+" successful")});
    
    const contentSchema = new mongoose.Schema({
        _id: Number,
        object: String
      });
      const historySchema = new mongoose.Schema({
        _id: Number,
        werte: String,
        value_pre: String,
     
        value_post: String
    })
    const domainoperationsSchema = new mongoose.Schema({
        wert: String
    })
    content=conn.model("content",contentSchema);
    history=conn.model("history",historySchema);
    DataDatadomainOperations=conn.model("domainOperations",domainoperationsSchema);
}

function GenerateTool(ENVvariables,tool){ //Welche ENVvariables braucht der Tool-Server?
    //CreateFrontend(parameter) //...
    imagename=tool.name.trim().replace(" ","-")
    ports.add(tool);
    port=ports.getPort(tool);//next free space of Ports
    ENVvariables={...ENVvariables}

    CopyFiles(ENVvariables); //server.js, dockerfile, package.json
    //imagename=CreateDockerImage() //returns name of DockerImage, projekt Github? Funktion soll image Builden und auf Dockerhub uploaden
    console.log("Imagename in GenerateTool", imagename)
    CreateCompose(port,imagename,ENVvariables);
    CreateImage();
    //BindCompose();//bindCompose under Port (Start) ?
}

function CopyFiles(envVariables){
    //envVariables={tiktok:"weißichnicht",blablacar:"keinFührerschein",sooderso:"freieWahl"}
    //  mongoAdminPW: process.env.MONGO_INITDB_ROOT_PASSWORD${envvariables}
    var OutputEnvVariables="";
    for(x in envVariables){
        OutputEnvVariables+=",\n  "+x+":process.env.ENV_"+x.toUpperCase();
    }
    OutputEnvVariables+=",\n  params:"+JSON.stringify(currentTool.param)
    //tool.js
    fs.readFile("template/tool-template.js", 'utf8', function(err, data) {
        if (err) throw err;
                write('./build/tool.js', data,"Saved build/tool.js!")             
                /*fs.writeFile('/build\\html\\func.js', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build\\html\\func.js!');
                    });*/
        });
    //keys.js
    fs.readFile("template/keys-template.js", 'utf8', function(err, data) {
       // if (err) throw err;                
        data= data.replace("${envvariables}",OutputEnvVariables)
                fs.writeFile('build/keys.js', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build/keys.js!');
                    });
      });
    //nichts zu ersetzen
    fs.readFile("template/server-template.js", 'utf8',(err, data)=>{
        //if (err) throw err;              
                fs.writeFile('build/server.js', data, function (err){
                    if (err) throw err;
                    console.log('Saved build/server.js!');
                    });
    });
    fs.readFile("template/Dockerfile-template", 'utf8',(err, data)=>{
        //if (err) throw err;              
                fs.writeFile('build/Dockerfile', data, function (err){
                    if (err) throw err;
                    console.log('Saved build/Dockerfile!');
                    });
    });

    fs.readFile("template/package.json", 'utf8',(err, data)=>{
        //if (err) throw err;              
                fs.writeFile('build/package.json', data, function (err){
                    if (err) throw err;
                    console.log('Saved build/package.json!');
                    });
    });

}
function CreateImage(data){
    var ssh2= new SSH({
        host: "ec2-3-72-59-56.eu-central-1.compute.amazonaws.com",//'3.72.59.56', //oder ec2-3-72-59-56.eu-central-1.compute.amazonaws.com
        user: "ec2-user",//'ec2-user',
        key: data
    });
    
    ssh2.exec('ls -al /var/app/current/', {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr); // this-does-not-exist: command not found
        }
    })/*.exec('cd /var', {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr); // this-does-not-exist: command not found
        }
    }).exec('pwd', {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr); // this-does-not-exist: command not found
        }
    }).exec('cd /var', {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr); // this-does-not-exist: command not found
        }
    })*/.start();
}
function CreateCompose(port,imageName,envVariables){
    //port=3030,imageName="saka ohne bura",envVariables={tiktok:"weißichnicht",blablacar:"keinFührerschein",sooderso:"freieWahl"}
    console.log(imageName,typeof(imageName))
    imageName=imageName.replace(/ /g,"-")
    console.log("Imagename in Compose", imageName)
    var newEnvVariables="";
    for(x in envVariables){
        newEnvVariables+="      - ENV_"+x.toUpperCase()+"="+envVariables[x]+"\n"
    }
    fs.readFile("template/docker-compose-template.yml", 'utf8', function(err, data) {
        if (err) throw err;
                //console.log(data)
                data= data.replace("${port}",port).replace("${imagename}",imageName).replace("${envVariables}",newEnvVariables)
                fs.writeFile('image/docker-compose.yml', data, function (err) {
                    if (err) throw err;
                    console.log('Saved image/docker-compose.yml!');
                    });
      });

}
//input='Attribute1:String,\r\nAttributBeispiel:Number,\r\nAttribute1245:Boolean'
//json='{"Attribute1":"String","AttributBeispiel":"Number","Attribute1245":"Boolean"}'
function JsonFromString(input){
    /*input=`_id: Number,
    werte: String,
    value_pre: String,
    value_post: String`*/
    //input='Attribute1:String,\r\nAttributBeispiel:Number,\r\nAttribute1245:Boolean'
    input=input.replace(/ /g,"").replace(/,/g,'","').replace(/:/g,'":"').replace(/[\r\n]/g, "");
    input='{"'+input+'"}'
    // abc= {
    //     _id: Number,
    //     werte: String,
    //     value_pre: String,
    //     value_post: String
    // }
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
function Schema(input){
    input=input.replace(/ /g,"").split(";");
    input = [...new Set(input)] //only unique values
    return input;
}
function Testfunktion(){
    abc= {
        _id: Number,
        werte: String,
        value_pre: String,
        value_post: String
    }
    console.log(abc)
    return abc
}
//https://stackoverflow.com/questions/14249506/how-can-i-wait-in-node-js-javascript-l-need-to-pause-for-a-period-of-time
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async function write(path, data, endmessage){
    console.log("Should write at "+path)
    //console.log("content",data)
    fs.writeFileSync(path, data, function (err) {
        if (err) throw err;
        console.log(endmessage);
        });
  }

process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})