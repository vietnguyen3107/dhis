var React = require("react");
var EducationForm = require("./education-form");
var EducationList = require("./education-list");
var EducationStore = require("../stores/education-store");



var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var EducationPanel = React.createClass({
    
    _onChange: function() {
        this.setState({
            educations: EducationStore.getEducations(),
        })
    },
    getInitialState: function() {
        return {
            educations: [],
        }
    },
    componentDidMount: function() {
        EducationStore.addChangeListener(this._onChange);
    },
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <EducationForm />
                                </div>
                            </div>

                            <div className="row">
                                <div className='col-md-12'>
                                    <EducationList educations={this.state.educations}/>
                                </div>
                            </div>
                  
                </div>
            </div>
        );
    }
});

module.exports = EducationPanel;