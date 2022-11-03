const { match } = require('assert');
const express = require('express');
const { CLIENT_RENEG_WINDOW } = require('tls');
const app= express()
var mongoose= require('mongoose');
const { env } = require('process');
app.use(express.urlencoded());
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));
var fs = require('fs')
  , filename = __dirname+"/src/html/input.txt";
var parametercontent={}
const keys = require("./keys");
const { mongoAdmin, mongoAdminPW } = require('./keys');
var morgan = require('mongoose-morgan');
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
    })
    morgan.format('myformat', ':date[Europe/Germany] | :method | :url | :response-time ms');
    //app.use(morgan('myformat'))

initiate();



console.log("Hallo Welt!")
const DBschema = new mongoose.Schema({
    Operations: {
         type: String,
         enum : ['Asave','Bsave','Csave','Dsave','Esave']
     }
 })
 const Building = mongoose.model("Test",DBschema);

main().catch(err => console.log(err));

async function main() {
 mongoose.connection.on('error', err => {
  console.log(err);
});
await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: 'testDB'}).then(()=>{console.log("Mongoose Connection successful")});

  
  const kittySchema = new mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function speak() {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  };
    const Kitten = mongoose.model('Kitten', kittySchema);
    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'
    const fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak(); // "Meow name is fluffy"
    await Kitten.find({ name: /^fluff/ }).then((abc)=>(console.log(abc)));
    var MySchema= new mongoose.Schema({
        title: String,
        cont: String,
        Operation: String
    },{collection: "erstesTestmodel"})
   var DataData=  mongoose.model("ErstesTestModel",MySchema)
   var blablacar=new DataData({title:"Test1",cont:"Test2",Operation:"Test3"});
   blablacar.save();
}



 //console.log("mongoose.connect('mongodb://localhost/'"+keys.mongoHost+"\":\""+keys.mongoPort+")");
 //mongoose.connect('mongodb://localhost/'+keys.mongoHost+":"+keys.mongoPort+"/Test");
app.use('/node_modules', express.static(__dirname+"/node_modules/"));
app.use("/",express.static(__dirname+"/src/html/"));
app.use("/leaflet-providers",express.static(__dirname+"/node_modules/leaflet-providers/leaflet-providers.js"))

app.get("/index",(req,res,next)=>{
    //res.send(req.params.id)
    res.sendFile(__dirname+"/src/html/index.html")
    })
app.get("/overview",(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/overview.html")
    })
app.get("/",(req,res,next)=>{
    //res.send(req.params.id)
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
app.post("/upload",(req,res)=>{
    console.log("Upload incoming: ",req.body)
    })
app.post("/",(req,res)=>{
    console.log("Post incoming: ",req.body)
    safe(req.body);
    res.send("<html> <form action=\"/output.html\">"
    +"<input type=\"submit\" value=\"Vorschau\" /></form>")
    })



function initiate(){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        //console.log('OK: ' + filename);
        //console.log(typeof(data))
        matches=[...data.matchAll(/\/\/\$(.*)\$/gm)]
        //console.log(`Hello ${matches[1]} ${matches[1]}`);
        /*console.log(matches[1][0],matches[1][1],matches[1].index,matches[0][0].length,)
        console.log(data.slice(matches[0].index+matches[0][0].length+2,matches[1].index-2))
        console.log(data.slice(matches[1].index+matches[1][0].length+2,matches[2].index-2))*/
        cfg=matches[1][1]
        data=data+"\r\n"
        //console.log(data)
        for(i=0;i<matches.length;i++){
            //das geht bestimmt irgendwie besser als mit if...
            if(i+1>=matches.length){
                c=data.length
            }else{
                c=matches[i+1].index //\r\n
            }
            //https://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
            parametercontent={...parametercontent,[matches[i][1]]:data.slice(matches[i].index+matches[i][0].length+2,c)}
        }
        //console.log(parametercontent)

      });
}
function safe(param){
        //neue Datei anlegen und Auswahl reinkopieren
        //outstring=parametercontent[...params]
        output=""
        //console.log("param in safe: ",param)
        //console.log("Object.getOwnPropertyNames(",Object.getOwnPropertyNames(param))
        for (x in param) {
            if (parametercontent[x]!=undefined&&typeof(x)=="string"){
                output+=parametercontent[x]
            }
            //console.log(typeof(param[x]),param[x])
            if(typeof(param[x])=="object"){
                i=0;
                for (y of param[x]){
                    /*console.log("parametercontent[y]!=undefined&&typeof(x)==\"string\"",parametercontent[y]!=undefined&&typeof(x)=="string")
                    console.log("typeof(x)==\"string\"",typeof(y)=="string")
                    console.log("parametercontent[y]!=undefined",parametercontent[y]!=undefined,y)*/
                    if (parametercontent[y]!=undefined&&typeof(y)=="string"){
                        output+=parametercontent[y]
                    }
                    if(i<param[x].length-1){
                        output+=","
                    }
                    i++;
                }
            }
        }
        console.log(output)
        fs.writeFile('src\\html\\output.html', output, function (err) {
            if (err) throw err;
            console.log('Saved!');
            });
}
process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})
//ToDo
//vue oä für overview
//hübsche datei evtl header mit bootstrap?
//import export Funktion
//Anzahl der Farben
//Marker farbig machen