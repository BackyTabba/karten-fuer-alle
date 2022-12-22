module.exports = {
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoAdmin: process.env.MONGO_INITDB_ROOT_USERNAME,  
  mongoAdminPW: process.env.MONGO_INITDB_ROOT_PASSWORD,
  params:{"ToolName":"Datenerhebung-Tschad","content":{"start":"true","Polygon":"true","Marker":"true","Rectangle":"true","Circle":"true","Polyline":"true","end":"true","open":"true","save":"true","OpenStreetMap":"true","CartoDb.Positron":"true","CartoDB.DarkMatter":"true","CartoDB.Voyager":"true","OpenStreetMap.Mapnik":"true","OpenTopoMap":"true","Stadia.AlidadeSmoothDark":"true","Stadia.OSMBright":"true","Esri.WorldImagery":"true"},"schema":"Vererbung;Verkauf;Verpachten;Konfliktaenderung","DataTypeInput":"parcelID:Number,\r\nValueInt:Number,\r\nSubmission:String,\r\nRightSourc:String,\r\nShareFract:Number,\r\nConflit:Boolean"}
};
