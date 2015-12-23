var React = require("react");
var DisciplineForm = require("./discipline-form");
var DisciplineList = require("./discipline-list");
var DisciplineStore = require("../stores/discipline-store");



var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var DisciplinePanel = React.createClass({
    
    _onChange: function() {
		
        this.setState({
            disciplines: DisciplineStore.getDisciplines(),
        });
		
		console.log(this.state.disciplines);
    },
    getInitialState: function() {
        return {
            disciplines: [],
        }
    },
    componentDidMount: function() {
        DisciplineStore.addChangeListenerDiscipline(this._onChange);
    },
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <DisciplineForm />
                                </div>
                            </div>

                            <div className="row">
                                <div className='col-md-12'>
                                    <DisciplineList disciplines={self.state.disciplines}/>
                                </div>
                            </div>
                  
                </div>
            </div>
        );
    }
});

module.exports = DisciplinePanel;