var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var RecensionConstants = require("../constants/recension-constants");

var CHANGE_EVENT = 'person_change';
var CHANGE_EDIT_EVENT = 'person_change_edit';

var _persons = [];
var _personByRecensions = [];
var _editingIndex = -1;



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

function _addPerson(person, callback) {

    var instance = {};
    //instance.trackedEntity = "MpkDhZb08jv";
    instance.trackedEntity = _config.trackedEntityUid;
    //instance.orgUnit = "qjoyPJWgSou";

	if(person.orgUnit == null || typeof person.orgUnit === undefined){
		alert("OrgUnit must be not null");
        if (typeof callback === "function") {
            callback();
        }
		return;
	}
    instance.orgUnit = person.orgUnit.value;
    var attributes = [];
    Object.keys(person).forEach(function(key){
        if(typeof person[key].uid !== "undefined"

            ){
            var attr = {};
            attr.attribute = person[key].uid;
            attr.value = person[key].value;
            attributes.push(attr);
        }
    });

    instance.attributes = attributes;

    console.log(instance);
    //return false;

    // PUT data
    $.ajax({
        url: _queryURL_api + 'trackedEntityInstances/',
        type: 'POST',
        data: JSON.stringify(instance ),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {
            if(response.status == "SUCCESS"){
                person.instance = {value: response.reference};
                person.trackedEntityInstance = {value: response.reference};
                if (typeof callback === "function") {
                    _persons.push(person);

                    _editingIndex = _persons.length - 1;
                    callback();
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);

            if (typeof callback === "function") {
                callback();
            }
        }
    });



}

function _removePerson(index) {
	if(index == _editingIndex){
		_editingIndex = -1;
	}else if(index < _editingIndex){
		_editingIndex--;
	}
    if(confirm("Do you want ro remove this person?")){
		$.ajax({
			url: _queryURL_api + 'trackedEntityInstances/' + _persons[index].instance.value,
			type: 'DELETE',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			traditional: true,
			success: function(response) {

				if (typeof callback === "function") {
					_persons.splice(index, 1);
					callback();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status + ":" + thrownError + ajaxOptions);
			}
		});


	}
}

function _editPerson(index, callback) {
    _editingIndex = index;
    callback();
}

function _updatePerson(person, callback) {
    var instance = {};

    console.log("editPerson");
    console.log(person);
    instance.trackedEntity = person.trackedEntity.value;
    instance.orgUnit = person.orgUnit.value;
    var attributes = [];
    Object.keys(person).forEach(function(key){
        if(typeof person[key].uid !== "undefined"

            ){
            var attr = {};
            attr.attribute = person[key].uid;
            attr.value = person[key].value;
            attributes.push(attr);
        }
    });

    instance.attributes = attributes;


    var enrollData = {};
    enrollData.trackedEntityInstance = person.instance.value;
    enrollData.orgUnit = person.orgUnit.value;
    enrollData.program = _config.programUid;
    enrollData.enrollmentDate = moment().format("YYYY-MM-DD");
    enrollData.incidentDate = moment().format("YYYY-MM-DD");

    //enroll to program
    $.ajax({
        url: _queryURL_api + 'enrollments',
        type: 'POST',
        data: JSON.stringify(enrollData ),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });


    // PUT data
    $.ajax({
        url: _queryURL_api + 'trackedEntityInstances/' + person.instance.value,
        type: 'PUT',
        data: JSON.stringify(instance ),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {

            if (typeof callback === "function") {
				if(_personByRecensions.length > 0)
				{
					_personByRecensions[_editingIndex] = person;

				}
				else
				{
					_persons[_editingIndex] = person;

				}
                //_editingIndex = -1;
                callback();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });
}

function _updateListPerson(persons, callback) {


    console.log("update list");
	var list = [];

	persons.forEach(function(person){
		var instance = {};
		instance.trackedEntityInstance = person.instance.value;
		instance.trackedEntity = person.trackedEntity.value;
		instance.orgUnit = person.orgUnit.value;
		var attributes = [];
		Object.keys(person).forEach(function(key){
			if(typeof person[key].uid !== "undefined"

				){
				var attr = {};
				attr.attribute = person[key].uid;
				attr.value = person[key].value;
				attributes.push(attr);
			}
		});

		instance.attributes = attributes;

		// PUT data
		$("*").css("cursor", "wait");
		$.ajax({
			url: _queryURL_api + 'trackedEntityInstances/' + instance.trackedEntityInstance,
			type: 'PUT',
			data: JSON.stringify(instance ),
			async: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			traditional: true,
			success: function(response) {
				$("*").css("cursor", "default");
				console.log(response);
				if (typeof callback === "function") {
					callback();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status + ":" + thrownError + ajaxOptions);
			}
		});

		list.push(instance);

	});

	//var trackEntities = {trackedEntityInstances: list};


}

function _addPersonToRecension(index, recension, callback) {
    var instance = {};
	_editingIndex = index;

	var person = jQuery.extend(true, {}, _persons[_editingIndex]);
	person["recension"] = {};
    person["recension"].value = recension.code.value;
    person["recension"].uid = "rDhgZbgg3Nt";

    instance.trackedEntity = person.trackedEntity.value;
    instance.orgUnit = person.orgUnit.value;
    var attributes = [];
	Object.keys(person).forEach(function(key){
        if(typeof person[key].uid !== "undefined")
		{
            var attr = {};
            attr.attribute = person[key].uid;
            attr.value = person[key].value;
            attributes.push(attr);
        }
    });

    instance.attributes = attributes;
	console.log("add to recension ");
	console.log(instance);
    // PUT data
    $.ajax({
        url: _queryURL_api + 'trackedEntityInstances/' + person.instance.value,
        type: 'PUT',
        data: JSON.stringify(instance ),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {

            if (typeof callback === "function") {
                 _persons[_editingIndex] = person;
                _editingIndex = -1;
				_personByRecensions.push(person);

                callback();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });
}

function _searchPerson(person, callback) {
    var conditionSearch = "&pageSize=20";
            if(person != null  ){
				if(person.firstName != "")
					conditionSearch += "&filter=vSS6J7ALd24:LIKE:" + person.firstName;
				if(person.orgUnitUid != "")
					conditionSearch += "&ou=" + person.orgUnitUid;
          if(person.applicationStatus != null && person.applicationStatus != ""){
            conditionSearch += "&filter=GvDIApK7R0j:IN:" + person.applicationStatus;
          }
          if(person.discipline != null && person.discipline != ""){
            conditionSearch += "&filter=KuoPvulbl3f:IN:" + person.discipline;
          }
          if(person.appDateFrom != null && person.appDateFrom != ""){
            conditionSearch += "&created>=" + person.appDateFrom;
          }
          

			}


    $.get(_queryURL_api + "trackedEntityInstances.json?" + conditionSearch, function (json){
        //paging    //-------start paging----------------

        var rows = json.trackedEntityInstances;
        _persons.splice(0, _persons.length);

        rows.forEach(function(entry) {
            var person = {};
            person.orgUnit = {value:entry.orgUnit};
            person.instance = {value:entry.trackedEntityInstance};
            person.trackedEntityInstance = {value:entry.trackedEntityInstance};
            person.trackedEntity = {value:entry.trackedEntity};

            person.applicationFileId = {value:entry.trackedEntityInstance};
            person.created = {value:entry.created};
            var i =0;
            entry.attributes.forEach(function(attr) {

              var val = {value: attr.value, uid: attr.attribute};
              person[lowercaseFirstLetter(attr.code)] = val;
              i++;
            });


            _persons.push(person);
        });
				callback();
			});
}

function _searchPersonByRecension(person, callback) {
    var conditionSearch = "&pageSize=20";
            if(person != null  ){

				if(person.recension != "")
					conditionSearch += "&filter=rDhgZbgg3Nt:EQ:" + person.recension;
				if(person.orgUnitUid != "")
					conditionSearch += "&ou=" + person.orgUnitUid;

			}


            $.get(_queryURL_api + "trackedEntityInstances.json?" + conditionSearch, function (json){
                //paging    //-------start paging----------------

                var rows = json.trackedEntityInstances;
                _personByRecensions.splice(0, _personByRecensions.length);

                rows.forEach(function(entry) {
                    var person = {};
                    person.orgUnit = {value:entry.orgUnit};
                    person.instance = {value:entry.trackedEntityInstance};
                    person.trackedEntityInstance = {value:entry.trackedEntityInstance};
                    person.trackedEntity = {value:entry.trackedEntity};

                    person.applicationFileId = {value:entry.trackedEntityInstance};
                    person.created = {value:entry.created};
                    var i =0;
                    entry.attributes.forEach(function(attr) {

                        var val = {value: attr.value, uid: attr.attribute};
                        person[lowercaseFirstLetter(attr.code)] = val;
                        i++;
                    });


                    _personByRecensions.push(person);
                });
				callback();
			});
}

function lowercaseFirstLetter(s) {
    if(typeof s  !== "undefined")
		return s.charAt(0).toLowerCase() + s.slice(1);
	else{
		return s;
	}
}

// var base_url = "http://apps.dhis2.org/demo/";
//   var login = 'dhis-web-commons-security/login.action?authOnly=true';
//   var current_user_url = 'api/users.json';
//   var params = {
//        'j_username':'admin',
//       'j_password':'district'
//  };
// // Create Base64 Object
// var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

//  function base_64_auth(user,password) {
//       var tok = user + ':' + password;
//       var hash = Base64.encode(tok);
//       return "Basic " + hash;
//  }

//  var auth = base_64_auth('admin','district');


var PersonStore  = _.extend(EventEmitter.prototype, {
    getPersons: function() {
        return _persons;
    },
	getPersonByRecensions: function() {
        return _personByRecensions;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    getEditingPerson: function() {
        if (_editingIndex < 0) {
            return null;
        }
		if(_personByRecensions.length > 0)
		{
			//console.log(jQuery.extend(true, {}, _personByRecensions[_editingIndex]));
			return jQuery.extend(true, {}, _personByRecensions[_editingIndex]);
		}
        return jQuery.extend(true, {}, _persons[_editingIndex]);
        // return _persons[_editingIndex];
    },
    getEditingPersonByRecension: function() {
        if (_editingIndex < 0) {
            return null;
        }
        return jQuery.extend(true, {}, _personByRecensions[_editingIndex]);
        // return _persons[_editingIndex];
    },
    emitEditPerson: function(callback) {

        this.emit(CHANGE_EDIT_EVENT, callback);
    },
    addEditPersonListener: function(callback) {
        this.on(CHANGE_EDIT_EVENT, callback);
    },
});

AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case PersonConstants.ACTION_ADD:
            _addPerson(payload.person,function(){PersonStore.emitChange();});
            break;

        case PersonConstants.ACTION_REMOVE:
            _removePerson(payload.index);

			PersonStore.emitEditPerson();
            PersonStore.emitChange();
            break;

        case PersonConstants.ACTION_EDIT:
            _editPerson(payload.index,function(){PersonStore.emitEditPerson();});

            break;

        case PersonConstants.ACTION_UPDATE:
            _updatePerson(payload.person, function(){
                PersonStore.emitEditPerson();
                PersonStore.emitChange();
            });

            break;
        case PersonConstants.ACTION_UPDATE_LIST:
            _updateListPerson(payload.persons, function(){
                PersonStore.emitEditPerson();
                PersonStore.emitChange();
            });

            break;
        case PersonConstants.ACTION_SEARCH:
			_searchPerson(payload.person, function(){PersonStore.emitChange();  });
            break;

        case PersonConstants.ACTION_ADD_TO_RECENSION:
			_addPersonToRecension(payload.index, payload.recension, function(){PersonStore.emitChange();  });
            break;

        case PersonConstants.ACTION_SEARCH_BY_RECENSION:
			_searchPerson(payload.person, function(){PersonStore.emitChange();  });
            break;

        case RecensionConstants.ACTION_EDIT_DETAIL:
			_searchPersonByRecension(payload.person, function(){PersonStore.emitChange();  });
            break;

    }
});

module.exports = PersonStore;
