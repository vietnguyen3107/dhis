var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var Label = require("react-bootstrap").Label;
var moment = require("moment");
var PersonList = require("./person-list"),
    PersonActions = require("../actions/person-actions"),
    PersonStore = require("../stores/person-store");


var RecensionStore = require("../stores/recension-store");
var RecensionActions = require("../actions/recension-actions");


    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
	
var RecensionDetailForm = React.createClass({
    _onEdit: function() {
        var editingRecension = RecensionStore.getEditingRecension();
        if(editingRecension  ){
            this.setState({
				
                editingRecension: editingRecension,
                editingRecensionUid: editingRecension.uid.value,
				persons: PersonStore.getPersons()
            });
			
        }else{
            this.setState({
                editingRecensionUid: null,
                editingRecension: null,
            });
        }
		
		
    },
	_onClickClose: function() {        
        RecensionActions.closeDetailRecension();
    },
    getInitialState: function() {
		PersonActions.searchPerson({firstName: 'test', orgUnitUid: 'zmqii2FMVkS'});
        return {
            hide: {display:'none'},
            editingRecension: null,
            editingRecensionUid : null,
			persons : []
        }
    },
	componentWillUpdate: function(prevProps, prevState){
		//PersonActions.searchPerson({firstName: 'test', orgUnitUid: 'zmqii2FMVkS'});
	},
    componentDidMount: function() {
		RecensionStore.addEditListener(this._onEdit);
		
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="success" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="success"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form" style={self.props.showStatus != "detail" ?  self.state.hide  : {}}>
            <div className="row">

                <div className="col-md-4 form-group-sm">
                <label>recensionFromDate</label>
                    <span> 
					{(self.state.editingRecension == null || self.state.editingRecension.recensionFromDate == null) ? "": self.state.editingRecension.recensionFromDate.value }
							
					</span>
                </div>

                <div className="col-md-4 form-group-sm">
                <label>recensionMeetingDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        
                        
                        selected=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionMeetingDate) ? 
                                moment(self.state.editingRecension.recensionMeetingDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionMeetingDate == null && self.state.editingRecension[self.state.attrs["recensionMeetingDate"]]) ?
                                    moment(self.state.editingRecension[self.state.attrs["recensionMeetingDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>


                <div className="col-md-4 form-group-sm">
                <label>recensionIssuedDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        
                        
                        selected=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionIssuedDate) ? 
                                moment(self.state.editingRecension.recensionIssuedDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionIssuedDate == null && self.state.editingRecension[self.state.attrs["recensionIssuedDate"]]) ?
                                    moment(self.state.editingRecension[self.state.attrs["recensionIssuedDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

                <div className="col-md-4 form-group-sm">
                <label>recensionToDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        
                        
                        selected=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionToDate) ? 
                                moment(self.state.editingRecension.recensionToDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionToDate == null && self.state.editingRecension[self.state.attrs["recensionToDate"]]) ?
                                    moment(self.state.editingRecension[self.state.attrs["recensionToDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>


                <div className="col-md-4">
                    <label>recensionChairPosition</label>
                    <Input type="text" bsSize="small"                        
                        

                        value=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionChairPosition) ? 
                                self.state.editingRecension.recensionChairPosition.value : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionChairPosition == null && self.state.editingRecension[self.state.attrs["recensionChairPosition"]]) ?
                                        self.state.editingRecension[self.state.attrs["recensionChairPosition"]].value  : "")
                        }
                    />
                        
                </div>

                <div className="col-md-4">
                    <label>recensionChairPerson</label>
                    <Input type="text" bsSize="small"                        
                        
                        value=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionChairPerson) ? 
                                self.state.editingRecension.recensionChairPerson.value : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionChairPerson == null && self.state.editingRecension[self.state.attrs["recensionChairPerson"]]) ?
                                        self.state.editingRecension[self.state.attrs["recensionChairPerson"]].value  : "")
                        }
                    />
                        
                </div>
				
                <div className="col-md-4 form-group-sm">
                <label>recensionStatus*</label>
                <SimpleSelect
                        name="recensionStatus"    
                        
                        options={self.state.recensionStatuses}
                        value=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionStatus) ? 
                                self.state.editingRecension.recensionStatus.value : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionStatus == null && self.state.editingRecension[self.state.attrs["recensionStatus"]]) ?
                                        self.state.editingRecension[self.state.attrs["recensionStatus"]].value  : "")
                        }
                ></SimpleSelect>

                   
                </div>


            </div>
            
            <div className="row">
                <div className="col-md-12">
                   <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    
                    <div  className="pull-right">
                    <Button bsStyle="default" onClick={self._onClickClose}>Close</Button>
                    </div>
                </div>
            </div>
			<div className="row">
				<div className="col-md-12">
					<PersonList persons={this.state.persons}  />
				</div>
			</div>

            </form>
        );
    }
});

module.exports = RecensionDetailForm;