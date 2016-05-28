var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    ExperienceConstants = require("../constants/experience-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var EXPERIENCE_CHANGE_EVENT = 'experience_change';
var EXPERIENCE_CHANGE_EDIT_EVENT = 'experience_change_edit';

var _personIdExperience = "";
var _editingIndexExperience = -1;
var _experiences = [];

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


function _searchExperience(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize="+ _config.pageSize;
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.experienceStageUid;
    }

    $.get(_queryURL_api + "events.json?" + conditionSearch, function (json){
        var rows = json.events;
        _experiences.splice(0, _experiences.length);

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

                _experiences.push(_p);
            });
        }
        if (typeof callback === "function") {
            callback();
        }
    });
       
}

function _addExperience(experience, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.experienceStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "COMPLETED";

    var dataValues = [];
    Object.keys(experience).forEach(function(key){
        if(typeof experience[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = experience[key].uid;
            dv.value = experience[key].value;
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
                experience.event = {value: response.reference};
                if (typeof callback === "function") {
                    _experiences.push(experience);
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


function _editExperience(index, callback) {
    _editingIndexExperience = index;

    callback();
}

function _updateExperience(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.experienceStageUid;

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
                    _experiences[_editingIndexExperience] = obj;
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


var ExperienceStore  = _.extend(EventEmitter.prototype, {
    getExperiences: function() {
        return _experiences;
    },
    getEditingExperience: function() {
        if (_editingIndexExperience < 0) {
            return null;
        }
        return jQuery.extend(true, {}, _experiences[_editingIndexExperience]);

    },
    emitChangeExperience: function() {
        this.emit(EXPERIENCE_CHANGE_EVENT);
    },
    addChangeListenerExperience: function(callback) {
        this.on(EXPERIENCE_CHANGE_EVENT, callback);
    },
    emitEditExperience: function(callback) {
        this.emit(EXPERIENCE_CHANGE_EDIT_EVENT, callback);
    },
    addEditListenerExperience: function(callback) {
        this.on(EXPERIENCE_CHANGE_EDIT_EVENT, callback);
    },
});

AppDispatcher.register(function(payload) {
    switch (payload.action) {
        //PERSON
        case PersonConstants.ACTION_EDIT:
				_editingIndexExperience = -1;
				ExperienceStore.emitEditExperience();
            _searchExperience(payload.index,function(){
				
                ExperienceStore.emitChangeExperience();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _experiences.splice(0, _experiences.length);

            _editingIndexExperience = -1;
            ExperienceStore.emitChangeExperience();  
            ExperienceStore.emitEditExperience();
            break;
        

        //Experience
        case ExperienceConstants.ACTION_ADD:
            _addExperience(payload.experience,function(){
                ExperienceStore.emitChangeExperience();
            });
            break;
        case ExperienceConstants.ACTION_EDIT:
            _editExperience(payload.index,function(){
                ExperienceStore.emitEditExperience();
            });
            break;
        case ExperienceConstants.ACTION_UPDATE:
            _updateExperience(payload.obj,function(){
                ExperienceStore.emitChangeExperience();
            });
            break;
    }
});

module.exports = ExperienceStore;