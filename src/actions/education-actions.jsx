var EducationConstants = require("../constants/education-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var EducationActions = {
    addEducation: function(education) {
        AppDispatcher.dispatch({
            action: EducationConstants.ACTION_ADD,
            education: education,
        })
    },
    removeEducation: function(index) {
        AppDispatcher.dispatch({
            action: EducationConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editEducation: function(index) {
        AppDispatcher.dispatch({
            action: EducationConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateEducation: function(obj) {
        AppDispatcher.dispatch({
            action: EducationConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchEducation: function(education) {
        AppDispatcher.dispatch({
            action: EducationConstants.ACTION_SEARCH,
            education: education,
        })
    },

}

module.exports = EducationActions;