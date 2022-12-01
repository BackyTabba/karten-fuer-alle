
 module.exports = {
    Tool:function Tool(param){
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
        this.Schema=function Schema(input){
            input=input.replace(/ /g,"").split(";");
            input = [...new Set(input)] //only unique values
            return input;
        };
        this.name=param.ToolName;
        this.param=param;
        this.schema=this.Schema(param.schema);
        this.DataTypeInput=this.JsonFromString(param.DataTypeInput);
        this.content=param.content;
        this.DB={}
        this.DB.content={};
        this.DB.history={};
        this.DB.DataDatadomainOperations={};
        this.OutputHTML="";
        this.EtablishConnection= async function EtablishConnection(){
            var conn= mongoose.createConnection('mongodb://'+mongoAdmin+":"+mongoAdminPW+'@mongo:27017/',{dbName: this.name},()=>{console.log("Mongoose Connection to "+this.name+" successful")})
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
        this.EtablishConnection();
    }
 }