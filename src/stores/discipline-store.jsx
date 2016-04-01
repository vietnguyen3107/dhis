var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    DisciplineConstants = require("../constants/discipline-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var DISCIPLINE_CHANGE_EVENT = 'discipline_change';
var DISCIPLINE_CHANGE_EDIT_EVENT = 'discipline_change_edit';

var _personIdDiscipline = "";
var _editingIndexDiscipline = -1;
var _disciplines = [];

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


function _searchDiscipline(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize="+ _config.pageSize;
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.disciplineStageUid;
    }

    $.get(_queryURL_api + "events.json?" + conditionSearch, function (json){
        var rows = json.events;
        _disciplines.splice(0, _disciplines.length);

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

                _disciplines.push(_p);
            });
        }
		
        if (typeof callback === "function") {
			
			console.log(_disciplines);
            callback();
        }
    });
       
}

function _addDiscipline(discipline, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.disciplineStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "COMPLETED";

    var dataValues = [];
    Object.keys(discipline).forEach(function(key){
        if(typeof discipline[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = discipline[key].uid;
            dv.value = discipline[key].value;
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
                    _disciplines.push(discipline);
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


function _editDiscipline(index, callback) {
    _editingIndexDiscipline = index;

    callback();
}

function _updateDiscipline(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.DisciplineStageUid;

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
                    _disciplines[_editingIndexDiscipline] = obj;
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


var DisciplineStore  = _.extend(EventEmitter.prototype, {
    getDisciplines: function() {
        return _disciplines;
    },
    getEditingDiscipline: function() {
        if (_editingIndexDiscipline < 0) {
            return null;
        }
		
        return jQuery.extend(true, {}, _disciplines[_editingIndexDiscipline]);

    },
    emitChangeDiscipline: function() {
        this.emit(DISCIPLINE_CHANGE_EVENT);
    },
    addChangeListenerDiscipline: function(callback) {
        this.on(DISCIPLINE_CHANGE_EVENT, callback);
    },
    emitEditDiscipline: function(callback) {
        this.emit(DISCIPLINE_CHANGE_EDIT_EVENT, callback);
    },
    addEditListenerDiscipline: function(callback) {
        this.on(DISCIPLINE_CHANGE_EDIT_EVENT, callback);
    },
});

AppDispatcher.register(function(payload) {
    switch (payload.action) {
        //PERSON
        case PersonConstants.ACTION_EDIT:
				_editingIndexDiscipline = -1;
				DisciplineStore.emitEditDiscipline();
            _searchDiscipline(payload.index,function(){
				
                DisciplineStore.emitChangeDiscipline();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _disciplines.splice(0, _disciplines.length);

            _editingIndexDiscipline = -1;
            DisciplineStore.emitChangeDiscipline();  
            DisciplineStore.emitEditDiscipline();
            break;
        

        //Discipline
        case DisciplineConstants.ACTION_ADD:
            _addDiscipline(payload.discipline,function(){
                DisciplineStore.emitChangeDiscipline();
            });
            break;
        case DisciplineConstants.ACTION_EDIT:
            _editDiscipline(payload.index,function(){
                DisciplineStore.emitEditDiscipline();
            });
            break;
        case DisciplineConstants.ACTION_UPDATE:
            _updateDiscipline(payload.obj,function(){
                DisciplineStore.emitChangeDiscipline();
            });
            break;
    }
});

module.exports = DisciplineStore;