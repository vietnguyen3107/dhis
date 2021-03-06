var PersonConstants = require("../constants/person-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var PersonActions = {
    addPerson: function(person) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_ADD,
            person: person,
        })
    },
    removePerson: function(index) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editPerson: function(index) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_EDIT,
            index: index,
        })
    },
    updatePerson: function(person) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_UPDATE,
            person: person,
        })
    },
    updateListPerson: function(persons) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_UPDATE_LIST,
            persons: persons,
        })
    },
    searchPerson: function(person) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_SEARCH,
            person: person,
        })
    },
    searchPersonByRecension: function(person) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_SEARCH_BY_RECENSION,
            person: person,
        })
    },
    addPersonToRecension: function(index, recension) {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_ADD_TO_RECENSION,
            index: index,
            recension: recension,
        })
    },
    clearPerson: function() {
        AppDispatcher.dispatch({
            action: PersonConstants.ACTION_CLEAR
        })
    },

}

module.exports = PersonActions;