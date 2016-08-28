var React = require("react");
var ExperienceForm = require("./experience-form");
var ExperienceList = require("./experience-list");
var ExperienceStore = require("../stores/experience-store");



var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var ExperiencePanel = React.createClass({
    
    _onChange: function() {
		if (this.isMounted()) {
			this.setState({
				experiences: ExperienceStore.getExperiences(),
			})
		}
    },
    getInitialState: function() {
        return {
            experiences: [],
        }
    },
    componentDidMount: function() {
        ExperienceStore.addChangeListenerExperience(this._onChange);
    },
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <ExperienceForm />
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className='col-md-12'>
                                    <ExperienceList experiences={this.state.experiences}/>
                                </div>
                            </div>
                  
                </div>
            </div>
        );
    }
});

module.exports = ExperiencePanel;