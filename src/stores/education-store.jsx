var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    EducationConstants = require("../constants/education-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var CHANGE_EVENT = 'education_change';
var CHANGE_EDIT_EVENT = 'education_change_edit';

var _personId = "";
var _editingIndexEducation = -1;
var _educations = [];

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


function _searchEducation(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize="+ _config.pageSize;
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.educationStageUid;
    }

    $.get(_queryURL_api + "events.json?" + conditionSearch, function (json){
        var rows = json.events;
        _educations.splice(0, _educations.length);

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

                _educations.push(_p);
            });
        }
        if (typeof callback === "function") {
            callback();
        }
    });
       
}

function _addEducation(education, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.educationStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "COMPLETED";

    var dataValues = [];
    Object.keys(education).forEach(function(key){
        if(typeof education[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = education[key].uid;
            dv.value = education[key].value;
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
                    _educations.push(education);
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


function _editEducation(index, callback) {
    _editingIndexEducation = index;
    callback();
}

function _updateEducation(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.educationStageUid;

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
                    _educations[_editingIndexEducation] = obj;
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


var EducationStore  = _.extend(EventEmitter.prototype, {
    getEducations: function() {
        return _educations;
    },
    getEditingEducation: function() {
        if (_editingIndexEducation < 0) {
            return null;
        }
        return jQuery.extend(true, {}, _educations[_editingIndexEducation]);

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
			_editingIndexEducation = -1; 
            EducationStore.emitEdit();
			
            _searchEducation(payload.index,function(){
                EducationStore.emitChange();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _educations.splice(0, _educations.length);

            _editingIndexEducation = -1;
            EducationStore.emitChange();  
            EducationStore.emitEdit();
            break;
        

        //EDUCATION
        case EducationConstants.ACTION_ADD:
            _addEducation(payload.education,function(){
                EducationStore.emitChange();
            });
            break;
        case EducationConstants.ACTION_EDIT:
            _editEducation(payload.index,function(){
                EducationStore.emitEdit();
            });
            break;
        case EducationConstants.ACTION_UPDATE:
            _updateEducation(payload.obj,function(){
                EducationStore.emitChange();
            });
            break;
    }
});

module.exports = EducationStore;