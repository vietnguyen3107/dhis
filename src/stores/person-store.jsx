var _ = require("underscore"),
    PersonConstants = require("../constants/person-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';
var CHANGE_EDIT_EVENT = 'change_edit';

var _persons = [];
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
    instance.trackedEntity = "MpkDhZb08jv";
    instance.orgUnit = "qjoyPJWgSou";
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
    // return false;

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
                    callback();
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });

    
   
}

function _removePerson(index) {
	if(index == _editingIndex){
		_editingIndex = -1;
	}else if(index < _editingIndex){
		_editingIndex--;
	}
    if(confirm("Do you want ro remove this person?"))
        _persons.splice(index, 1);
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
    enrollData.enrollmentDate = '2015-12-12';
    enrollData.incidentDate = '2015-12-12';
    
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
            alert(xhr.status + ":" + thrownError + ajaxOptions);
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
                 _persons[_editingIndex] = person;
                //_editingIndex = -1;
                callback();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + thrownError + ajaxOptions);
        }
    });
}

function _searchPerson(person) {
    console.log('search...' + person.firstName);
    // var toremove= new Array(); 
    // _persons.map(function(stu, index) {
        
    //     if ( stu.name.toUpperCase().lastIndexOf(person.name.toUpperCase()) < 0 ) {
    //         toremove.push(stu);
    //     }
    // });
    // if ( toremove != null ) {
    //     for ( t = 0; t < toremove.length; t++ ) {
    //         console.log( toremove[t].name + " is index " +_persons.indexOf(toremove[t]));
    //         _persons.splice(_persons.indexOf(toremove[t]), 1);
    //     }
    // }

    _persons = [];
}

function lowercaseFirstLetter(s) {
    return s.charAt(0).toLowerCase() + s.slice(1);
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
        return jQuery.extend(true, {}, _persons[_editingIndex]);
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
        case PersonConstants.ACTION_SEARCH:
            var conditionSearch = "&pageSize=20";
            if(payload.person != null && payload.person.firstName != "")
                conditionSearch += "&filter=vSS6J7ALd24:LIKE:" + payload.person.firstName;

            $.get(_queryURL_api + "trackedEntityInstances.json?ou=qjoyPJWgSou&" + conditionSearch, function (json){
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

                //_persons = [{firstName: 'Nguyen Quoc Hùng', country: {label:'Việt Nam', value: 'vn'}}, {firstName: 'Nguyen Thi Thúy Hằng',country: {label:'Việt Nam', value: 'vn'}}];
                PersonStore.emitChange();  
                //console.log(json.username);
            });


            
            break;
    }
});

module.exports = PersonStore;