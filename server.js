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
var portcount=10;
ports.add=function(Tool){
    if(ports.length==portcount-1){ //ports volle länge, also erstes element löschen
        del=ports.shift()
        console.log(del.tool.ToolName+" is removed from Ports")
    }
    ports.push({"tool":tool,"port":startingport+ports.length})
    return ports[ports.length]
    //push mounting tool
}
ports.getPort= function (Tool){
    for(x in ports){
        if (x.tool.ToolName==Tool.ToolName){
            return x;
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
    schema: 'Asave;Bsave;Csave;Dsave',
    DataTypeInput:'Attribute1:String,\r\nAttributBeispiel:Number,\r\nAttribute1245:Boolean'
  }
  TempTool= new Tool(incomingCall)



initiateParametercontent();

//main().catch(err => console.log(err));


app.use('/node_modules', express.static(__dirname+"/node_modules/"));
app.use("/",express.static(__dirname+"/src/html/"));
app.use("/leaflet-providers",express.static(__dirname+"/node_modules/leaflet-providers/leaflet-providers.js"))

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
    
    TempTool.DB.content.deleteOne({_id:req.body._id},(error,doc)=>{
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
    TempTool.DB.DataDatadomainOperations.find({},(err,docs)=>{console.log("..sending schema..");res.send(docs)})
})
app.get("/upload",(req,res)=>{
    TempTool.EtablishConnection();
    TempTool.DB.content.find({}, function (err, docs) {res.send(docs)})
    //console.log(data)
    //res.send(data);
})
app.get("/history",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    //console.log("/popup req.body:",req)
    TempTool.DB.history.find({"RealID":req.query._id}, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.get("/popup",(req,res)=>{
    console.log("query",req.query);
    console.log(req.query._id)
    //console.log("/popup req.body:",req)

    TempTool.DB.DataInput.findById(req.query._id, function (err, docs) {
        console.log(docs);
        res.send(docs)})
})
app.post("/popup",(req,res)=>{
    console.log("Ab hier beginnt der most recent Test")
    console.log(req.body)//"_id":req.body._id,...req.body
    console.log("req.body._id",req.body._id)
    //console.log(TempTool.DB.DataInput.log())
    console.log(JSON.stringify(req.body))
    TempTool.DB.DataInput.findByIdAndUpdate(req.body._id,req.body,{upsert: true,new: true,returnDocument:'after'},
        (error, doc) => {
            if(error!=null){
            console.log("error",error)
        }else{
            console.log("doc",doc);
        }

        const count = TempTool.DB.history.countDocuments({RealID:req.body._id},(err,count)=>{
            console.log('there are %d entrys for id in history already', count);
            if(count==0){
                req.body.DomainOperations="Initialize"
            }
            TempTool.DB.history.create({RealID:req.body._id,version:count,DataDatadomainOperation:req.body.DomainOperations,value_post:req.body},{returnDocument:'after'},(error, doc) => {
                if(error!=null){
                console.log("error",error)
            }else{
                console.log("doc",doc);
            }
        });
        
        
        })
    })
    res.sendStatus(200);
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
    data = TempTool.DB.content.findByIdAndUpdate(req.body._id,{ "object": req.body.content,"_id":req.body._id},{upsert: true,new: true,returnDocument:'after'},
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
app.get("/abba",(req,res)=>{
    //JsonFromString();
    console.log(TempTool.getPopupString())
    res.send(TempTool.getPopupString())
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
    this.schema=Schema(param.schema);
    this.DataTypeInput=JsonFromString(param.DataTypeInput);
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
        console.log(this.schema)
        if(this.schema.length>1){
            for (x of this.schema) {//Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
                this.DB.DataDatadomainOperations.findOneAndUpdate({"wert":x},{"wert":x},{upsert: true,new: true},(err,docs)=>{console.log("DDO anlegen",err,docs)})
            }
        }else{
            this.DB.DataDatadomainOperations.findOneAndUpdate({"wert":this.schema},{"wert":this.schema},{upsert: true,new: true},(err,docs)=>{console.log("DDO anlegen",err,docs)})
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

        outputstr=`
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script
			  src="https://code.jquery.com/jquery-3.6.1.min.js"
			  integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
			  crossorigin="anonymous"></script>
        <form action="/popup" method="POST" id="take"> \n     <fieldset>\n`
        console.log("getPopupString().getDataKeys(): ",this.getDataKeys())
        for (x of this.getDataKeys()){
            validationPattern="";
            title="";
            console.log("getPopupString() this.DataTypeInput[x].name:",this.DataTypeInput[x].name)
                if(x!=="_id"){
                switch(this.DataTypeInput[x].name){
                    case "String": validationPattern='"^.*$"'; title="Ab-cDe.F54,2sg"; break
                    case "Number": validationPattern='"^\\d*(.|,)?\\d*$"'; title="133245553.055 \| 113124 \| 1151515,04"; break
                    case "Boolean": validationPattern='"^(True|true|False|false)$"'; title="True \| False"; break
                    default : console.log("getPopupString(): Kein vailidationPattern passt..."); validationPattern="^.*$"; break
                }
                //console.log("getPopupString() nach Ermittlung des validation Patterns: ",outputstr, validationPattern,title)
                outputstr+='<div><label for="'+x+'">'+x+'</label><input type="text" id="'+x+'" name="'+x+'" value="" required pattern='+validationPattern+' title="'+title+'"></div> \n'
                }
            }

        //Select
        //console.log(this.schema)
        outputstr+='<div><select name="DomainOperations" id="DomainOperations">\n'
        for(x of this.schema){
                outputstr+='"<option value="'+x+'">'+x+'</option>+\n'

        }
        outputstr+='</select>\n '
        outputstr+='<input type="text" id="_id" name="_id" hidden="true" value=${value}>'
        outputstr+='<input type="submit" value="Senden">'
        outputstr+=' <div hidden="true" name="Message" id="Message">Refreshing...</div>'
        outputstr+=' <div style="color:green" hidden="true" name="SubmitSuccess" id="SubmitSuccess">Success</div>'
       outputstr+='</fieldset>\n</form>';
       outputstr+='<div><label for="history">Objekthistorie</label></div>'
       outputstr+='<textarea id="history" name="history rows="6" cols="30"></textarea>'
       //https://stackoverflow.com/questions/1960240/jquery-ajax-submit-form
       outputstr+=`
       <script>
       var frm = $('#take');
       $('#Message').show()

        $.get("/history",{"_id":$('#_id').attr("value")},(data)=>{
            console.log(data)
            if(data=={}){
                $('#DomainOperations').hide()
            }
            //historyfeld value auffüllen
            for (x of data){
                $('#history').val($('#history').val()+\\n+x.DataDatadomainOperation)
                console.log(x.DataDatadomainOperation)
            }
            $('#Message').hide()
        })
        $.get("/popup",{_id:$('#_id').val()},(data)=>{
            console.log(data)
            for(x in data){
                $("#"+x).val(data[x])
                }
        })
       </script>
        <script type="text/javascript">
        var frm = $('#take');

                frm.submit(function (e) {

                    e.preventDefault();

                    $.ajax({
                        type: frm.attr('method'),
                        url: frm.attr('action'),
                        data: frm.serialize(),
                        success: function (data) {
                            console.log('Submission was successful.');
                            console.log(data);
                            $('#SubmitSuccess').removeAttr('hidden');
                        },
                        error: function (data) {
                            console.log('An error occurred.');
                            console.log(data);
                        },
                    });
                });
            </script>`
       



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

function GenerateTool(ENVvariables){
    CreateFrontend(parameter) //...
    CopyFiles(ENVvariables); //server.js, dockerfile, package.json
    imagename=CreateDockerImage() //returns name of DockerImage, projekt Github?
    port=getPort(Tool);//next free space of Ports
    CreateCompose(port,imagename,ENVvariables);
    BindCompose();//bindCompose under Port (Start) ?
}

function CopyFiles(ENVvariables){
    envVariables={tiktok:"weißichnicht",blablacar:"keinFührerschein",sooderso:"freieWahl"}
    //  mongoAdminPW: process.env.MONGO_INITDB_ROOT_PASSWORD${envvariables}
    var OutputEnvVariables="";
    for(x in envVariables){
        OutputEnvVariables+=",\n  "+x+":process.env."+x.toUpperCase();
    }

    //keys.js
    fs.readFile("template\\keys-template.js", 'utf8', function(err, data) {
        if (err) throw err;                
        data= data.replace("${envvariables}",OutputEnvVariables)
                fs.writeFile('build\\keys.js', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build\\keys.js!');
                    });
      });
    //nichts zu ersetzen
    fs.readFile("template\\server-template.js", 'utf8',(err, data)=>{
        if (err) throw err;              
                fs.writeFile('build\\server.js', data, function (err){
                    if (err) throw err;
                    console.log('Saved build\\server.js!');
                    });
    });
    fs.readFile("template\\Dockerfile-template", 'utf8',(err, data)=>{
        if (err) throw err;              
                fs.writeFile('build\\Dockerfile', data, function (err){
                    if (err) throw err;
                    console.log('Saved build\\Dockerfile!');
                    });
    });

}
function CreateCompose(port,imageName,envVariables){
    //port=3030,imageName="saka ohne bura",envVariables={tiktok:"weißichnicht",blablacar:"keinFührerschein",sooderso:"freieWahl"}
    imageName=imageName.replace(/ /g,"-")
    var newEnvVariables="";
    for(x in envVariables){
        newEnvVariables+="      - ENV_"+x.toUpperCase()+":"+envVariables[x]+"\n"
    }
    fs.readFile("template\\docker-compose-template.yml", 'utf8', function(err, data) {
        if (err) throw err;
                //console.log(data)
                data= data.replace("${port}",port).replace("${imagename}",imageName).replace("${envVariables}",newEnvVariables)
                fs.writeFile('build\\docker-compose.yml', data, function (err) {
                    if (err) throw err;
                    console.log('Saved build\\docker-compose.yml!');
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
            case "Number"|"number":
                output[x]=Number
                break;
            case "String"|"string":
                output[x]=String
                break;
            case "Boolean"|"boolean":
                output[x]=Boolean
                break;
        }
    }
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

process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})