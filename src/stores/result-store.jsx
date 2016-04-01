var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    ResultConstants = require("../constants/result-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var CHANGE_EVENT = 'result_change';
var CHANGE_EDIT_EVENT = 'result_change_edit';

var _personId = "";
var _editingIndexResult = -1;
var _result = {};

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


function _searchResult(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize=1";
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.resultStageUid ;
    }

    $.get(_queryURL_api + "events.json?" + conditionSearch, function (json){
        var rows = json.events;

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

                _result = _p;
            });
        }
		

        if (typeof callback === "function") {
            callback();
        }
    });
       
}

function _addResult(result, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.resultStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "ACTIVE";

    var dataValues = [];
    Object.keys(result).forEach(function(key){
        if(typeof result[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = result[key].uid;
            dv.value = result[key].value;
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
                obj.event = {value: response.reference};
                if (typeof callback === "function") {
                    
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


function _editResult(index, callback) {

}

function _updateResult(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.resultStageUid;

    o.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    o.eventDate = moment();
    o.status = "ACTIVE";

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
				_result = obj;
		
                if (typeof callback === "function") {
                    
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


var ResultStore  = _.extend(EventEmitter.prototype, {
    getResult: function() {
        return _result;
    },
    getEditingResult: function() {
        return _result;

    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    emitEdit: function(callback) {
        this.emit(CHANGE_EDIT_EVENT, callback);
    },

    addEditListener: function(callback) {
        this.on(CHANGE_EDIT_EVENT, callback);
    },
});

AppDispatcher.register(function(payload) {
    switch (payload.action) {
        //PERSON
        case PersonConstants.ACTION_EDIT:
			_result = null; 
            
			
            _searchResult(payload.index,function(){
                ResultStore.emitChange();
				ResultStore.emitEdit();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _result = null; 
           
            ResultStore.emitChange();  
            ResultStore.emitEdit();
            break;
        

        //result
        case ResultConstants.ACTION_ADD:
            _addResult(payload.result,function(){
				_searchResult(0,function(){
					ResultStore.emitChange();
					ResultStore.emitEdit();
				});
            });
            break;
        case ResultConstants.ACTION_EDIT:
            _editResult(payload.index,function(){
                ResultStore.emitEdit();
            });
            break;
        case ResultConstants.ACTION_UPDATE:
            _updateResult(payload.obj,function(){
                ResultStore.emitChange();
            });
            break;
    }
});

module.exports = ResultStore;