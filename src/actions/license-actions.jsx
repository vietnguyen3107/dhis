var LicenseConstants = require("../constants/license-constants"),
    AppDispatcher = require("../dispatcher/app-dispatcher");

var LicenseActions = {
    addLicense: function(license) {
        AppDispatcher.dispatch({
            action: LicenseConstants.ACTION_ADD,
            license: license,
        })
    },
    removeLicense: function(index) {
        AppDispatcher.dispatch({
            action: LicenseConstants.ACTION_REMOVE,
            index: index,
        })
    },
    editLicense: function(index) {
        AppDispatcher.dispatch({
            action: LicenseConstants.ACTION_EDIT,
            index: index,
        })
    },
    updateLicense: function(obj) {
        AppDispatcher.dispatch({
            action: LicenseConstants.ACTION_UPDATE,
            obj: obj,
        })
    },
    searchLicense: function(license) {
        AppDispatcher.dispatch({
            action: LicenseConstants.ACTION_SEARCH,
            license: license,
        })
    },

}

module.exports = LicenseActions;