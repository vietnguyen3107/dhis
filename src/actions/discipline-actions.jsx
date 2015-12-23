var DisciplineConstants = require("../constants/discipline-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var DisciplineActions = {
    addDiscipline: function(discipline) {
        AppDispatcher.dispatch({
            action: DisciplineConstants.ACTION_ADD,
            discipline: discipline,
        })
    },
    removeDiscipline: function(index) {
        AppDispatcher.dispatch({
            action: DisciplineConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editDiscipline: function(index) {
        AppDispatcher.dispatch({
            action: DisciplineConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateDiscipline: function(obj) {
        AppDispatcher.dispatch({
            action: DisciplineConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchDiscipline: function(discipline) {
        AppDispatcher.dispatch({
            action: DisciplineConstants.ACTION_SEARCH,
            discipline: discipline,
        })
    },

}

module.exports = DisciplineActions;