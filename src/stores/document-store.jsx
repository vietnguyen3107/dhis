var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    DocumentConstants = require("../constants/document-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var DISCIPLINE_CHANGE_EVENT = 'document_change';
var DISCIPLINE_CHANGE_EDIT_EVENT = 'document_change_edit';

var _personIdDocument = "";
var _editingIndexDocument = -1;
var _documents = [];

// -- 
    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);

// -- App Manifest Json (Get this via Synch, so that it is defined ahead)
    var _appManifest = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "manifest.webapp",
        async: false
    }).responseText);

// -- URLs
    var _dhisSiteURL = _appManifest.activities.dhis.href.replace( '/dhis-web-maintenance-appmanager', '' ) + '/';
    var _dhisHomeURL = _dhisSiteURL + 'dhis-web-dashboard-integration/index.action';

    var _queryURL_api = _dhisSiteURL + 'api/';

function lowercaseFirstLetter(s) {
	if(typeof s  !== "undefined")
		return s.charAt(0).toLowerCase() + s.slice(1);
	else{
		return s;
	}
}


function _searchDocument(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize="+ _config.pageSize;
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.documentStageUid;
    }

    $.get(_queryURL_api + "events.json?" + conditionSearch, function (json){
        var rows = json.events;
        _documents.splice(0, _documents.length);

        if(typeof rows !== "undefined" && rows.length > 0){
            rows.forEach(function(entry) {
                var _p = {};
                _p.event = {value:entry.event};
                _p.status = {value:entry.status};
                _p.program = {value:entry.program};
                _p.programStage = {value:entry.programStage};
                _p.enrollment = {value:entry.enrollment};
                _p.enrollmentStatus = {value:entry.enrollmentStatus};
                _p.orgUnit = {value:entry.orgUnit};
                _p.orgUnitName = {value:entry.orgUnitName};
                _p.trackedEntityInstance = {value:entry.trackedEntityInstance};
                _p.eventDate = {value:entry.eventDate};
                _p.dueDate = {value:entry.dueDate};


                var i =0;
                if(typeof entry.dataValues !== "undefined" && entry.dataValues.length > 0){
                    entry.dataValues.forEach(function(attr) {

                        var val = {value: attr.value, uid: attr.dataElement};
                        _p[attr.dataElement] = val;
                        i++;
                    });
                }

                _documents.push(_p);
            });
        }
		
        if (typeof callback === "function") {
			
			console.log(_documents);
            callback();
        }
    });
       
}

function _addDocument(document, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.documentStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "COMPLETED";

    var dataValues = [];
    Object.keys(document).forEach(function(key){
        if(typeof document[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = document[key].uid;
            dv.value = document[key].value;
            dataValues.push(dv); 
        } 
    });
    obj.dataValues = dataValues;

    // return false;
    // PUT data
    $.ajax({
        url: _queryURL_api + 'events/',
        type: 'POST',
        data: JSON.stringify(obj ),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {
            if(response.response.importSummaries[0].status == "SUCCESS"){
                document.event = {value: response.reference};
                if (typeof callback === "function") {
                    _documents.push(document);
                    callback();
                }

            }else{
                alert(response.response.importSummaries[0].description);

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });

}


function _editDocument(index, callback) {
    _editingIndexDocument = index;

    callback();
}

function _updateDocument(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.documentStageUid;

    o.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    o.eventDate = moment();
    o.status = "COMPLETED";

    var dataValues = [];
    Object.keys(obj).forEach(function(key){
        if(typeof obj[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = obj[key].uid;
            dv.value = obj[key].value;
            dataValues.push(dv); 
        } 
    });
    
    o.dataValues = dataValues;
	console.log(o);
    // return false;
    // PUT data
    $.ajax({
        url: _queryURL_api + 'events/' + obj.event.value,
        type: 'PUT',
        data: JSON.stringify(o),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {
            if(response.response.status == "SUCCESS"){
                if (typeof callback === "function") {
                    _documents[_editingIndexDocument] = obj;
                    callback();
                }

            }else{
                alert(response.response.status);

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });

}


var DocumentStore  = _.extend(EventEmitter.prototype, {
    getDocuments: function() {
        return _documents;
    },
    getEditingDocument: function() {
        if (_editingIndexDocument < 0) {
            return null;
        }
		console.log('editingdocument');
		console.log(jQuery.extend(true, {}, _documents[_editingIndexDocument]));
        return jQuery.extend(true, {}, _documents[_editingIndexDocument]);

    },
    emitChangeDocument: function() {
        this.emit(DISCIPLINE_CHANGE_EVENT);
    },
    addChangeListenerDocument: function(callback) {
        this.on(DISCIPLINE_CHANGE_EVENT, callback);
    },
    emitEditDocument: function(callback) {
        this.emit(DISCIPLINE_CHANGE_EDIT_EVENT, callback);
    },
    addEditListenerDocument: function(callback) {
        this.on(DISCIPLINE_CHANGE_EDIT_EVENT, callback);
    },
});

AppDispatcher.register(function(payload) {
    switch (payload.action) {
        //PERSON
        case PersonConstants.ACTION_EDIT:
				_editingIndexDocument = -1;
				DocumentStore.emitEditDocument();
            _searchDocument(payload.index,function(){
				
                DocumentStore.emitChangeDocument();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _documents.splice(0, _documents.length);

            _editingIndexDocument = -1;
            DocumentStore.emitChangeDocument();  
            DocumentStore.emitEditDocument();
            break;
        

        //Document
        case DocumentConstants.ACTION_ADD:
            _addDocument(payload.document,function(){
                DocumentStore.emitChangeDocument();
            });
            break;
        case DocumentConstants.ACTION_EDIT:
            _editDocument(payload.index,function(){
                DocumentStore.emitEditDocument();
            });
            break;
        case DocumentConstants.ACTION_UPDATE:
            _updateDocument(payload.obj,function(){
                DocumentStore.emitChangeDocument();
            });
            break;
    }
});

module.exports = DocumentStore;