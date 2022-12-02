//const { map } = require("leaflet");
function OnMapLoad(){
    $('#headline').text(ToolName);
    console.log("load fired")
    $.ajax({
        type: "GET",
        url: "/upload",
        success: console.log("Successful transmitted Get of all!")
    }).done((data)=>{
        console.log(data);
        AddToMap(data);
    });
}
function AddToMap(data){
    if(data.length==undefined){
        data=[data]
    }
    for (x of data) {
        //console.log("x",x,"data",data,"data[x]")

        layer=L.geoJSON(JSON.parse(x.object),{
            pointToLayer: (feature, latlng) => {
                if (feature.properties.radius) {
                return new L.Circle(latlng, feature.properties.radius);
                } else {
                return new L.Marker(latlng);
                }
            },
            onEachFeature: function (feature, layer) {
                /*console.log("nun wird hier gearbeitet__________________________________________________________________________")
                console.log(layer);
                RealID=layer._eventParents[Object.keys(layer._eventParents)[0]].RealID
                $.get("/popup",RealID,(doc,err)=>{
                    console.log("AddToMap, doc, nachschlagen: "+doc)
                    layer.feature.properties={...layer.feature.properties,...doc}
                })
                console.log(layer.feature.properties);*/
                layer.on('click', function (event) {
                new L.Toolbar2.EditToolbar.Popup(event.latlng, {
                    actions: editActions
                }).addTo(map, layer);});
                layer.on("edit", function(evt) {
                    console.log("edited layer:", evt.target)
                    layer = evt.target;
                    parentRealID=evt.target._eventParents[Object.keys(evt.target._eventParents)].RealID
                    $.get("/popup",{_id:parentRealID},(doc,err)=>{
                        console.log(doc)
                        console.log("HALLO HIER WIRD GEÄNDERT_____________________________________________________________")
                        console.log(layer)
                        layer.feature.properties={...layer.feature.properties,...doc}
                        $.ajax({ //upload Data
                            type: "POST",
                            url: "/upload",
                            data: {"content":JSON.stringify(LayerToJson(layer)),"_id":parentRealID},
                            success: console.log("Successful transmitted Edit of id:"+parentRealID+"!")
                            });
                    })
                    /*$.ajax({ //upload Data
                    type: "POST",
                    url: "/upload",
                    data: {"content":JSON.stringify(LayerToJson(layer)),"_id":parentRealID},
                    success: console.log("Successful transmitted Edit of id:"+parentRealID+"!")
                    });	*/
                })
                layer.on('click', function(event) {
                    layer.openPopup();
                    new L.Toolbar2.EditToolbar.Popup(event.latlng, {
                        actions: editActions
                    }).addTo(map, layer);
                })
            }
        })
        layer.RealID=x._id;
        layer.getRealID=function(){return this.RealID};
        //console.log("hier wird nun gearbeitet ______________________________________________________",layer)
        //console.log(layer._layers[Object.keys(layer._layers)[0]].feature)
        /*$.get("/popup",{_id:layer.RealID},(doc,err)=>{
            console.log("AddToMap ende, doc, nachschlagen: ",doc)
            if(doc!==""){
                delete doc._id
                delete doc.__v
                properties=layer._layers[Object.keys(layer._layers)[0]].feature.properties
                layer._layers[Object.keys(layer._layers)[0]].feature.properties={...properties,...doc}
                console.log("properties nach schreiben",layer._layers[Object.keys(layer._layers)[0]].feature.properties)
            }
            console.log("jetzt layer adden")     */    

        //})
        layer.addTo(map);
        drawnItems.addLayer(layer);
    }
}
function LayerToJson(layer) { //https://medium.com/geoman-blog/how-to-handle-circles-in-geojson-d04dcd6cb2e6
    output = layer.toGeoJSON();
    if (layer instanceof L.Circle) {
        output.properties.radius = layer.getRadius();
    }
    return output;
}

/*function GetPopupCreationString(RealID){
	output=PopupCreationString
	output= output.replace("${value}",RealID)
	return output
}
console.log(GetPopupCreationString(1234));*/

function GetPopupString(RealID){
	output=PopupString
	output= output.replace("${value}",RealID)
	return output
}


var socket = io();
socket.connect(window.location.protocol+"//"+window.location.host , {
  upgrade: false,
  transports: ['websocket']
})

var EditFromDB = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: { 
			className: 'fa fa-pencil'
		}
	},

	initialize: function (map, shape, options,event) {
		this._map = map;
		this._shape = shape;
		/*console.log("initialize")
		console.log("map",map,"shape", shape,"options", options,"layer",layer,"event",event)
		console.log(layer.getRealID())*/
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},

	enable: function () {
		console.log("enable")
		var map = this._map,
        shape = this._shape;
        console.log("shape:",shape)
		console.log(shape.Popupvar)
        console.log(shape._eventParents[Object.keys(shape._eventParents)[0]].getRealID())
		shape.Popupvar=!shape.Popupvar
		if(this._shape._popup==undefined){
		this._shape.bindPopup(GetPopupString(shape._eventParents[Object.keys(shape._eventParents)[0]].getRealID()),{"className":"another-popup"}).on("popupopen",function(){
			$.get("/history",{"_id":$('#_id').attr("value")},(data)=>{
				console.log("DATADATADATA",data,data.length==0)
				if(data.length==0){
                	$('#DomainOperations').hide()
    			}
				//historyfeld value auffüllen
				for (x of data){
					if($('#history').val()==""){$('#history').val(x.DataDatadomainOperation)}else{
					$('#history').val($('#history').val()+"\n"+x.DataDatadomainOperation)}
					console.log(x.DataDatadomainOperation)
				}
				$('#Message').hide()
			})
			$.get("/popup",{_id:$('#_id').val()},(data)=>{
				console.log(data)
                //drawnItems.getLayerByRealID(_id)._layers[Object.keys(drawnItems.getLayerByRealID(_id)._layers)[0]].feature.properties=data
				for(x in data){
					$("#"+x).val(data[x])
					}
			})
			$('#take').submit(function(e){
				//https://stackoverflow.com/questions/1960240/jquery-ajax-submit-form
					var frm = $('#take');
                    e.preventDefault();
                    console.log('frm.attr(action)+method',frm.attr('action')+" "+frm.attr('method'),"frm.serialize()",frm.serialize())
                    $.ajax({
                        type: frm.attr('method'),
                        url: frm.attr('action'),
                        data: frm.serialize(),
                        success: function (data) {
                            console.log('Submission was successful.');
                            console.log(data);
                            delete data._id
                            delete data.__v
                            properties=shape._eventParents[Object.keys(shape._eventParents)[0]]._layers[Object.keys(shape._eventParents[Object.keys(shape._eventParents)[0]]._layers)[0]].feature.properties
                            console.log(properties)
                            shape._eventParents[Object.keys(shape._eventParents)[0]]._layers[Object.keys(shape._eventParents[Object.keys(shape._eventParents)[0]]._layers)[0]].feature.properties={...properties,...data}
                            console.log(shape._eventParents[Object.keys(shape._eventParents)[0]]._layers[Object.keys(shape._eventParents[Object.keys(shape._eventParents)[0]]._layers)[0]].feature)
                            $('#SubmitSuccess').removeAttr('hidden');
                        },
                        error: function (data) {
                            console.log('An error occurred.');
                            console.log(data);
                        },
                    });
				});
		});
		}
		this._shape._popup.onload=()=>{alert("test")};
		shape.togglePopup();
		console.log("shape",shape)
		map.removeLayer(this.toolbar);
		map.on('click', function () {
			shape._popup.close();
			console.log(shape);
		}, this);
		shape.on('click', function () {
			this._shape._popup.close();
			console.log(shape);
		}, this);
	},
	disable: function(){
		console.log("disable")
		var map = this._map,
			shape = this._shape;
			shape._popup.close();

	}
});

var CloseToolbar=L.Toolbar2.Action.extend({						
        options: {
        toolbarIcon: { className: 'fa fa-times' },
        tooltip: 'Close'
    },
    initialize: function (map, overlay, options) {
    L.Toolbar2.Action.prototype.initialize.call(this, map, overlay, options);
    },
    addHooks: function () {
    map.removeLayer(this.toolbar);
    console.log(this)
    }
})

var saveGeooutput = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: { 
            //    &#128190; &#128427; &#x1F5AB; &#9873; &#128194; file folder https://www.compart.com/en/unicode/U+1F4C2
            html: '&#x1F5AB;',
            tooltip: 'Get GeoJson'
        },
        
    },
    addHooks: function () {
        console.log(JSON.stringify(drawnItems.toGeoJSON()));
        var toSave = encodeURIComponent(JSON.stringify(drawnItems.toGeoJSON()));
        console.log('toSave',toSave);
        //window.open("data:application/octet-stream,"+toSave,"_blank");
        window.open("data:application/octet-stream,"+toSave,"_blank");
        /*fileDialog({ multiple: false, accept: 'image/*' }, files => {
            //files contains an array of FileList
        })*/
    }

});



var openGeooutput = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: { 
            //    &#128190; &#128427; &#x1F5AB; &#9873; &#128194; file folder https://www.compart.com/en/unicode/U+1F4C2				
            html: '&#128194',
            tooltip: 'Upload GeoJson'
        },
    },
    addHooks: function () {
        console.log(document.getElementById("load-file").value);
        //console.log("L.geoJSON(JSON(temp0)).addTo(map)");
        document.getElementById("load-file").click();
        //$("#load-file").click();
        console.log(document.getElementById("load-file"))
        //$("#load-file").change(function(){
        document.getElementById("load-file").addEventListener("change",function loadFile (){
            var fr = new FileReader();
            fr.onload=function(){
                console.log(fr.result);
                console.log("JSON.parse",JSON.parse(fr.result));
                var FeatureCollectionObject=JSON.parse(fr.result)
                console.log("FeatureCollectionObject",FeatureCollectionObject)
                console.log("FeatureCollectionObject.features",FeatureCollectionObject.features)
                for(feature of FeatureCollectionObject.features){
                    console.log("feature",feature)
                    layer=L.geoJSON(feature)
                    console.log("layer",layer)
                    drawnItems.addLayer(layer);
                    map.addLayer(layer);
                    eventobject={"_leaflet_id":layer._leaflet_id+1,"layer":layer,"layertype":feature.geometry.type,"sourceTarget":map,"target":map,"type":"draw:created"}
                    RealID=layer._leaflet_id+1
                    data={_id:RealID,...feature.properties}
                    $.post("/popup",data)
                    console.log(data)
                    //post /popup
                    console.log(eventobject)
                    map.fire("draw:created",eventobject);
                }


                //___________________________________________________________________________________
                /*layer=L.geoJSON(JSON.parse(fr.result),{onEachFeature: function (feature, layer) {
                    //map.fire("draw:created",layer)
                    layer.on('click', function (event) {
                    new L.Toolbar2.EditToolbar.Popup(event.latlng, {
                        actions: editActions
                    }).addTo(map, layer);
                })
                }});
                console.log("layer",layer);
                layer.addTo(map);
                drawnItems.addLayer(layer);*/
                //_______________________________________________________________________________________
            }
            fr.readAsText(this.files[0])
            //document.getElementById("load-file").removeEventListener("change",this)
            document.getElementById("load-file").removeEventListener("change",loadFile,false)
        },false)
    }
});





// Toolbars


    //Erweiterungen



//Events
	//update event from DB
	socket.on("delete",(data)=>{
		console.log("delete from socket",data)
		console.log("data._id",data._id)
		console.log(drawnItems.getLayerByRealID(data._id));
		currentLayer=drawnItems.getLayerByRealID(data._id);
		drawnItems.removeLayer(currentLayer);
		}
	)
	socket.on("update",(data)=>{console.log("data from socket",data)
		//console.log("data._id",data._id)
		if(drawnItems.getLayerByRealID(data._id)!==undefined){
		//console.log(drawnItems.getLayerByRealID(data._id));
		currentLayer=drawnItems.getLayerByRealID(data._id);
		drawnItems.removeLayer(currentLayer);
		map.removeLayer(currentLayer);
		//drawnItems.removeLayer(currentLayer);
		}
		AddToMap(data);
		map.invalidateSize();
	});
	//websockets https://socket.io/get-started/chat
