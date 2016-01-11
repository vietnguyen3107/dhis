var ResultConstants = require("../constants/result-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var ResultActions = {
    addResult: function(result) {
        AppDispatcher.dispatch({
            action: ResultConstants.ACTION_ADD,
            result: result,
        })
    },
    removeResult: function(index) {
        AppDispatcher.dispatch({
            action: ResultConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editResult: function(index) {
        AppDispatcher.dispatch({
            action: ResultConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateResult: function(obj) {
        AppDispatcher.dispatch({
            action: ResultConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchResult: function(result) {
        AppDispatcher.dispatch({
            action: ResultConstants.ACTION_SEARCH,
            result: result,
        })
    },

}

module.exports = ResultActions;