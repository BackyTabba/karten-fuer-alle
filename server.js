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
const { type } = require('os');
const { throws } = require('assert');

var port=3000
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
var parameterorder=["start",["Polygon","Marker","Rectangle","Circle","Polyline"],"end","open","save","end2"]

var incomingCall={
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
    schema: ['Asave','Bsave','Csave','Dsave']
  }
  TempTool= new Tool(incomingCall)



initiateParametercontent();

//Todo: Datenbankschemata und Models definieren und anlegen
const DBschema = new mongoose.Schema({
    Operations: {
         type: String,
         enum : ['Asave','Bsave','Csave','Dsave','Esave']
     }
 })
 const Building = mongoose.model("Test",DBschema);

main().catch(err => console.log(err));

async function main() { //TESTZONE!
 mongoose.connection.on('error', err => {
  console.log(err);
});
var connections =[]
await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: 'testDB'}).then(()=>{console.log("Mongoose Connection successful")});

/*## nameApplikation_content
- Id: Leafletid
- objekt: Object
- If existing update, else create?*/


//Schema
  const toolSchema = new mongoose.Schema({
    //Id: Leafletid,
    objekt: Object
  });
  const kittySchema = new mongoose.Schema({
    name: String
  });

  kittySchema.methods.speak = function speak() {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  };
//Model
    const Kitten = mongoose.model('Kitten', kittySchema);
    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'
    const fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak(); // "Meow name is fluffy"
//Abfrage
    await Kitten.find({ name: /^fluff/ }).then((abc)=>(console.log(abc)));
//EigenerAblauf
    var MySchema= new mongoose.Schema({
        title: String,
        cont: String,
        Operation: String
    },{collection: "erstesTestmodel"})
   var DataData=  mongoose.model("ErstesTestModel",MySchema)
   var blablacar=new DataData({title:"Test1",cont:"Test2",Operation:"Test3"});
   blablacar.save();
}

app.use('/node_modules', express.static(__dirname+"/node_modules/"));
app.use("/",express.static(__dirname+"/src/html/"));
app.use("/leaflet-providers",express.static(__dirname+"/node_modules/leaflet-providers/leaflet-providers.js"))

app.get("/index",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })
app.get("/overview",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/overview.html")
    })
app.get("/",(req,res,next)=>{
    res.redirect("/index");
    })
app.get("/test",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/test.html")
    })
app.get("/params",(req,res)=>{
    console.log("Parameterrequest:")
    console.log(parametercontent)
    res.redirect("/")
})
app.post("/test",(req,res)=>{
    console.log("test incoming: ",req.body)
})
app.delete("/upload",(req,res)=>{
    console.log("incoming delete order",req.body)
    TempTool.DB.content.deleteOne({_id:req.body._id},(err,docs)=>{console.log(err,docs)})
})
app.get("/schema",(req,res)=>{
    console.log("schema requiest")
    TempTool.DB.DataDatadomainOperations.find({},(err,docs)=>{console.log("..sending schema..");res.send(docs)})
})
app.get("/upload",(req,res)=>{
    TempTool.EtablishConnection();
    TempTool.DB.content.find({}, function (err, docs) {res.send(docs)})
    //console.log(data)
    //res.send(data);
})
app.post("/upload",(req,res)=>{
    /*console.log("Upload incoming: ",req.body)
    console.log(TempTool.DB.content.inspect());
    console.log({ "content": req.body.content,"_id":req.body._id })*/
    //Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
    //Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
    console.log(req.body)
    data = TempTool.DB.content.findByIdAndUpdate(req.body._id,{ "object": req.body.content,"_id":req.body._id},{upsert: true,new: true,returnDocument:'after'},
    (error, doc) => {
         if(error!=null){
            console.log("error",error)
        }else{
            console.log("doc",doc);
            io.emit("update",doc);
        }
    })
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

app.post("/",(req,res)=>{
    console.log("Post incoming: ",req.body)
    currentTool = new Tool(req.body);
    currentTool.EtablishConnection();
    //save(req.body.content)
    //res.send(currentTool.createOutputHTML())
    /*res.send("<html> <form action=\"/output.html\">"
    +"<input type=\"submit\" value=\"Vorschau\" /></form>")*/
    res.redirect("/output.html")
    
    })
//DB-Routen


/**
 * Schreibt Inhalte in die Variable parametercontent aus der Inputdatei (Speicherort definiert in der Variable "filename")
 */
function initiateParametercontent(){
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
    this.schema=param.schema;
    console.log(this.schema)
    this.content=param.content;
    this.DB={}
    this.DB.content={};
    this.DB.history={};
    this.DB.DataDatadomainOperations={};
    this.OutputHTML="";
    this.createOutputHTML= function(...args){
        output=""
        this.outputString=output;

        for(x of parameterorder){ // parameterorder=["start",["Polygon","Marker","Rectangle","Circle","Polyline"],"end","open","save","end2"]
             if(this.content[x]=="true"){
                 output+=parametercontent[x]
             }
             if(x instanceof Object){ //Falls parameterorder ein Objekt enthält aka ["Polygon","Marker","Rectangle","Circle","Polyline"]
                 i=0;
                 for (y of x){ //Jeden String des Objekts nachschlagen und an output anhängen
                    //schönere Variante mit Iterator umsetzen? https://robdodson.me/posts/javascript-design-patterns-iterator/
                     if (y!=undefined&&typeof(y)=="string"&&this.content.actions[y]=="true"){ //unschön weil actions vorgegeben werden muss, da array mit object verglichen wird und das object einen namen hat, den das array nicht kennen kann
                         output+=parametercontent[y]
                     }
                     if(i<Object.keys(this.content.actions).length-1){
                         output+=","
                     }
                     i++;
                 }
             }
         }
         this.OutputHTML=output;
         return output;
    }
    this.save=function(){
        if(this.OutputHTML==""){
            this.createOutputHTML()
        }
        fs.writeFile('src\\html\\output.html',this.OutputHTML , function (err) {
            if (err) throw err;
            console.log('Saved output.html!');
            });
    }
    this.EtablishConnection= async function EtablishConnection(){
        var conn= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: this.name},()=>{console.log("Mongoose Connection to "+this.name+" successful")})
        //await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: Tool.name}).then(()=>{console.log("Mongoose Connection to "+Tool.name+" successful")});
        
        const contentSchema = new mongoose.Schema({
            _id: Number,
            "object": String
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
        this.DB.content=content=conn.model("content",contentSchema);
        this.DB.historyhistory=conn.model("history",historySchema);
        this.DB.DataDatadomainOperations=conn.model("domainOperations",domainoperationsSchema);
        console.log(this.schema)
        for (x of this.schema) {//Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
            this.DB.DataDatadomainOperations.findOneAndUpdate({"wert":x},{"wert":x},{upsert: true,new: true},(err,docs)=>{console.log("DDO anlegen",err,docs)})
        }
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


process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})