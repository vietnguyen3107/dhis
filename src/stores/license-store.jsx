var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    LicenseConstants = require("../constants/license-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");

var CHANGE_EVENT = 'license_change';
var CHANGE_EDIT_EVENT = 'license_change_edit';

var _personId = "";
var _editingIndexLicense = -1;
var _license = {};

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
    return s.charAt(0).toLowerCase() + s.slice(1);
}


function _searchLicense(index, callback) {
    var person = PersonStore.getEditingPerson();

    var conditionSearch = "pageSize=1";
    if(person != null && person.instance != ""){
        _personId = person.instance.value;
        conditionSearch += "&trackedEntityInstance=" +_personId+ "&programStage=" + _config.licenseStageUid + "&programStatus=ACTIVE";
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

                _license = _p;
            });
        }
		

        if (typeof callback === "function") {
            callback();
        }
    });
       
}

function _addLicense(license, callback){

    var obj = {};
    var editingPerson = PersonStore.getEditingPerson();

    obj.program = _config.programUid;
    obj.orgUnit = editingPerson.orgUnit.value;
    obj.programStage = _config.licenseStageUid;

    obj.trackedEntityInstance = editingPerson.trackedEntityInstance.value;
    obj.eventDate = moment();
    obj.status = "ACTIVE";

    var dataValues = [];
    Object.keys(license).forEach(function(key){
        if(typeof license[key].uid !== "undefined" ){            
            var dv = {};
            dv.dataElement = license[key].uid;
            dv.value = license[key].value;
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


function _editLicense(index, callback) {

}

function _updateLicense(obj, callback) {
    
    var o = {};
    var editingPerson = PersonStore.getEditingPerson();

    o.program = _config.programUid;
    o.orgUnit = editingPerson.orgUnit.value;
    o.programStage = _config.licenseStageUid;

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
				_license = obj;
		
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


var LicenseStore  = _.extend(EventEmitter.prototype, {
    getLicense: function() {
        return _license;
    },
    getEditingLicense: function() {
        return _license;

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
			_license = null; 
            
			
            _searchLicense(payload.index,function(){
                LicenseStore.emitChange();
				LicenseStore.emitEdit();
            });
            break;

        case PersonConstants.ACTION_CLEAR:
            _personId = "";
            _license = null; 
           
            LicenseStore.emitChange();  
            LicenseStore.emitEdit();
            break;
        

        //license
        case LicenseConstants.ACTION_ADD:
            _addLicense(payload.license,function(){
				_searchLicense(0,function(){
					LicenseStore.emitChange();
					LicenseStore.emitEdit();
				});
            });
            break;
        case LicenseConstants.ACTION_EDIT:
            _editLicense(payload.index,function(){
                LicenseStore.emitEdit();
            });
            break;
        case LicenseConstants.ACTION_UPDATE:
            _updateLicense(payload.obj,function(){
                LicenseStore.emitChange();
            });
            break;
    }
});

module.exports = LicenseStore;