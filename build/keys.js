
module.exports = {
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoAdmin: process.env.MONGO_INITDB_ROOT_USERNAME,  
  mongoAdminPW: process.env.MONGO_INITDB_ROOT_PASSWORD,
  port:3001,
  params:{
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
};
