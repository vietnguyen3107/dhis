var DocumentConstants = require("../constants/document-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var DocumentActions = {
    addDocument: function(document) {
        AppDispatcher.dispatch({
            action: DocumentConstants.ACTION_ADD,
            document: document,
        })
    },
    removeDocument: function(index) {
        AppDispatcher.dispatch({
            action: DocumentConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editDocument: function(index) {
        AppDispatcher.dispatch({
            action: DocumentConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateDocument: function(obj) {
        AppDispatcher.dispatch({
            action: DocumentConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchDocument: function(document) {
        AppDispatcher.dispatch({
            action: DocumentConstants.ACTION_SEARCH,
            document: document,
        })
    },

}

module.exports = DocumentActions;