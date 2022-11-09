const express = require('express');
const app= express()
var mongoose= require('mongoose');
const { env } = require('process');
app.use(express.urlencoded());
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));
var fs = require('fs')
const keys = require("./keys");
const { mongoAdmin, mongoAdminPW } = require('./keys');
const { type } = require('os');
/*var morgan = require('mongoose-morgan');

//todo Morgan vernünftig zum Laufen bringen
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
    })
morgan.format('myformat', ':date[Europe/Germany] | :method | :url | :response-time ms');*/
//app.use(morgan('myformat'))

//Variablendeklaration
filename = __dirname+"/src/html/input.txt";
var parametercontent={}
var parameterorder=["start",["Polygon","Marker","Rectangle","Circle","Polyline"],"end","open","save","end2"]
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
await mongoose.connect('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/', {dbName: 'testDB'}).then(()=>{console.log("Mongoose Connection successful")});
//Schema
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
app.post("/upload",(req,res)=>{
    console.log("Upload incoming: ",req.body)
    })
app.post("/",(req,res)=>{
    console.log("Post incoming: ",req.body)
    safe(req.body.content)
    res.send("<html> <form action=\"/output.html\">"
    +"<input type=\"submit\" value=\"Vorschau\" /></form>")
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
function safe(param){
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
           // console.log(x, parameterorder[x],'typeof(parameterorder[x])==Object',typeof(parameterorder[x])==Object,typeof(parameterorder[x]))
            if(x instanceof Object){ //Falls parameterorder ein Objekt enthält
                i=0;
                for (y of x){ //Jeden String des Objekts nachschlagen und an output anhängen
                    //console.log("object durchiterieren:", y, typeof(y), typeof(y)=="string")
                    if (y!=undefined&&typeof(y)=="string"){
                        output+=parametercontent[y]
                    }
                    if(i<x.length-1){
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
process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
})