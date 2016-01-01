var React = require("react");
var LicenseForm = require("./license-form");
var LicenseStore = require("../stores/license-store");



var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var LicensePanel = React.createClass({
   
    getInitialState: function() {
        return {
           
        }
    },
   
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <LicenseForm />
                                </div>
                            </div>

                          
                  
                </div>
            </div>
        );
    }
});

module.exports = LicensePanel;