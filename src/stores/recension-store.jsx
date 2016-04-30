var _ = require("underscore"),
    RecensionConstants = require("../constants/recension-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher"),
    EventEmitter = require('events').EventEmitter;
var moment = require("moment");
var PersonStore = require("../stores/person-store");
var PersonActions = require("../actions/person-actions");
var CHANGE_EVENT = 'recension_change';
var CHANGE_EDIT_EVENT = 'recension_change_edit';

var _editingIndexRecension = -1;
var _editDetailYN = false;
var _recensions = [];

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


function _searchRecension(recension, callback) {

	var url = _queryURL_api + "optionSets/" + _config.recensionUid + "?" + _config.optionFieldSearch;

    $.get(url, function (xml){
        var rows = xml.options;

        if(typeof rows !== "undefined" && rows.length > 0){

            rows.forEach(function(entry) {
                var _p = {};
                _p.uid = {value:entry.id};
                _p.code = {value:entry.code};
                _p.name = {value:entry.name};
                
                var i =0;
                if(typeof entry.dataValues !== "attributeValues" && entry.attributeValues.length > 0){
                    entry.attributeValues.forEach(function(attrValue) {
						var val = {value: attrValue.value, uid: attrValue.attribute.id, code: attrValue.attribute.code};
                        _p[attrValue.attribute.code] = val;
                        i++;
                    });
                }
                _recensions.push(_p);
               

            });
        }
		

        if (typeof callback === "function") {
            callback();
        }
    });
       
}

function _addRecension(obj, callback){
    var o = {};
	o.code = obj.code.value;
	o.name = obj.name.value;
	o.optionSet = _config.recensionUid;
	
    var attributeValues = [];
    Object.keys(obj).forEach(function(key){
        if(typeof obj[key].uid !== "undefined" ){            
            var dv = {};
            dv.attribute = {id: obj[key].uid};
            dv.value = obj[key].value;
            attributeValues.push(dv); 
        } 
    });
    
    o.attributeValues = attributeValues;
	console.log(o);
    // return false;
    // POST data
    $.ajax({
        url: _queryURL_api + 'options/',
        type: 'POST',
        data: JSON.stringify(o),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {
            if(response.response.status == "SUCCESS"){
				obj.uid = {value:response.response.lastImported};
				_recensions.push(obj);
		
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


function _editRecension(index, callback) {
	 _editingIndexRecension = index;
	 _editDetailYN = false;
    callback();
}

function _editDetailRecension(index, callback) {
	 _editingIndexRecension = index;
	 _editDetailYN = true;

    callback();
}

function _updateRecension(obj, callback) {
    
    var o = {};
	o.code = obj.code.value;
	o.name = obj.name.value;
	
    var attributeValues = [];
    Object.keys(obj).forEach(function(key){
        if(typeof obj[key].uid !== "undefined" ){            
            var dv = {};
            dv.attribute = {id: obj[key].uid};
            dv.value = obj[key].value;
            attributeValues.push(dv); 
        } 
    });
    
    o.attributeValues = attributeValues;
	console.log(o);
    // return false;
    // PUT data
    $.ajax({
        url: _queryURL_api + 'options/' + obj.uid.value,
        type: 'PUT',
        data: JSON.stringify(o),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function(response) {
            if(response.response.status == "SUCCESS"){
				_recensions[_editingIndexRecension] = obj;
		
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


var RecensionStore  = _.extend(EventEmitter.prototype, {
    getRecensions: function() {
        return _recensions;
    },
	getEditDetailYN: function() {
        return _editDetailYN;
    },
    getEditingRecension: function() {
        if (_editingIndexRecension < 0) {
            return null;
        }
        return jQuery.extend(true, {}, _recensions[_editingIndexRecension]);

    },

    getRecensionByIndex: function(index) {
        return jQuery.extend(true, {}, _recensions[index]);
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

RecensionStore.setMaxListeners(0);

AppDispatcher.register(function(payload) {
    switch (payload.action) {


        case RecensionConstants.ACTION_SEARCH:
           _editingIndexRecension = -1; 
            RecensionStore.emitEdit();
			
            _searchRecension(payload.recension, function(){
                RecensionStore.emitChange();
            });
            break;
        

        //recension
        case RecensionConstants.ACTION_ADD:
            _addRecension(payload.recension,function(){
				RecensionStore.emitChange();
            });
            break;
        case RecensionConstants.ACTION_EDIT:
            _editRecension(payload.index,function(){
                RecensionStore.emitEdit();
            });
            break;
        case RecensionConstants.ACTION_EDIT_DETAIL:
            _editDetailRecension(payload.index,function(){
                RecensionStore.emitEdit();
            });
            break;
        case RecensionConstants.ACTION_CLOSE_DETAIL:
				_editDetailYN = false;
				_editingIndexRecension = -1; 
                RecensionStore.emitEdit();
            
            break;
        case RecensionConstants.ACTION_UPDATE:
            _updateRecension(payload.obj,function(){
                RecensionStore.emitChange();
            });
            break;
    }
});

module.exports = RecensionStore;