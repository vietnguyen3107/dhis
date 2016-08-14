var React = require("react");
var RecensionForm = require("./recension-form");
var RecensionDetailForm = require("./recension-detail-form");
var RecensionList = require("./recension-list");
var RecensionStore = require("../stores/recension-store");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var Panel = require("react-bootstrap").Panel;
var moment = require("moment");
var RecensionActions = require("../actions/recension-actions");

var RecensionPanel = React.createClass({
    
    _onChange: function() {
        this.setState({
            recensions: RecensionStore.getRecensions(),
        })
    },
	_onEdit: function() {
		var editDetailYN = RecensionStore.getEditDetailYN();
		if(editDetailYN){
			this.setState({
				showStatus: "detail",
			});
		}else{
			this.setState({
				showStatus: "form",
			});
		}
    },
    getInitialState: function() {
        return {
			showStatus : 'form',
            recensions: [],
            me:{}
        }
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;
       
      
    },
    componentDidMount: function() {
        RecensionStore.addChangeListener(this._onChange);
		RecensionStore.addEditListener(this._onEdit);
          //me
        $.get("../../../../dhis/api/me.json?fields=*,organisationUnits[id,name,shortName,displayName]", function (json){
            RecensionActions.searchRecension({OrgUnitUID: json.organisationUnits[0].id});
            

        });
    },
    componentDidUpdate: function() {
        
    },
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
					<div className="row">
                        <div className='col-md-12'>
						   <RecensionDetailForm showStatus={this.state.showStatus}/>
						
                        </div>
                    </div>
				</div>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <RecensionForm showStatus={this.state.showStatus}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className='col-md-12'>
                                    <RecensionList recensions={this.state.recensions} showStatus={this.state.showStatus}/>
                                </div>
                            </div>
                  
                </div>
            </div>
        );
    }
});

module.exports = RecensionPanel;