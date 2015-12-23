var ExperienceConstants = require("../constants/experience-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var ExperienceActions = {
    addExperience: function(experience) {
        AppDispatcher.dispatch({
            action: ExperienceConstants.ACTION_ADD,
            experience: experience,
        })
    },
    removeExperience: function(index) {
        AppDispatcher.dispatch({
            action: ExperienceConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editExperience: function(index) {
        AppDispatcher.dispatch({
            action: ExperienceConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateExperience: function(obj) {
        AppDispatcher.dispatch({
            action: ExperienceConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchExperience: function(experience) {
        AppDispatcher.dispatch({
            action: ExperienceConstants.ACTION_SEARCH,
            experience: experience,
        })
    },

}

module.exports = ExperienceActions;