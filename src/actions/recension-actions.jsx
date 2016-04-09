var RecensionConstants = require("../constants/recension-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var RecensionActions = {
    addRecension: function(recension) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_ADD,
            recension: recension,
        })
    },
    removeRecension: function(index) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editRecension: function(index) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateRecension: function(obj) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchRecension: function(recension) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_SEARCH,
            recension: recension,
        })
    },
    editDetailRecension: function(index, person) {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_EDIT_DETAIL,
            index: index,
			person: person
        })
    },
    closeDetailRecension: function() {
        AppDispatcher.dispatch({
            action: RecensionConstants.ACTION_CLOSE_DETAIL
        })
    },
	

}

module.exports = RecensionActions;