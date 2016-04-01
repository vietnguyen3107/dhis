var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var RecensionStore = require("../stores/recension-store");
var RecensionActions = require("../actions/recension-actions");


    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
	
var RecensionForm = React.createClass({
    _onClickAdd: function() {        
        RecensionActions.addRecension(this.state.editingRecension);
    },
    _onClickUpdate: function() {
        RecensionActions.updateRecension(this.state.editingRecension);
    }, 
    _onClickClear: function() {
        this.setState({
            editingRecension: null,
            editingRecensionUid: null
        });
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingRecension == null ){
            this.state.editingRecension = {};
        }
        if(this.state.editingRecension[attr] == null){
            this.state.editingRecension[attr] = {};
            this.state.editingRecension[attr].value = val;
            this.state.editingRecension[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingRecension[attr].value = val;
        }

        console.log(this.state.editingRecension);


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingRecension == null ){
            this.state.editingRecension = {};
        }
        if(this.state.editingRecension[attr] == null){
            this.state.editingRecension[attr] = {};
            this.state.editingRecension[attr].value = val;
            this.state.editingRecension[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingRecension[attr].value = val;
        }

        console.log(this.state.editingRecension);


    },
    _onChange: function(attr, e) {

        if(this.state.editingRecension == null ){
            this.state.editingRecension = {};
        }
        if(this.state.editingRecension[attr] == null){
            this.state.editingRecension[attr] = {};
            this.state.editingRecension[attr].value = e.target.value;
            this.state.editingRecension[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingRecension[attr].value = e.target.value;
        }
        this.setState({
            editingRecension: this.state.editingRecension,
        });
        
    },
    _onEdit: function() {
        var editingRecension = RecensionStore.getEditingRecension();

        if(editingRecension  ){
            this.setState({
                editingRecension: editingRecension,
                editingRecensionUid: editingRecension.uid.value
            });
			
        }else{
            this.setState({
                editingRecensionUid: null,
                editingRecension: null,
            });
        }
    },
    getInitialState: function() {
        return {
            isLoading: false,
			hide : {display: 'none'},
            editingRecension: null,
            editingPersonUid : null,
            editingRecensionUid : null,
            recensionStatuses: [],
        }
    },
    componentDidMount: function() {
        RecensionStore.addEditListener(this._onEdit);
        RecensionStore.addChangeListener(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        //recensionStatus
        $.get("../../../../dhis/api/optionSets/vcyt1fmc4Zt?" + _config.optionFieldSearch, function (xml){
            
            var recensionStatuses = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                recensionStatuses.push(opt);
                
            });

            self.setState({recensionStatuses: recensionStatuses});
            
        });
        
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="success" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="success"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form" style={self.props.showStatus != "form" ? self.state.hide : {}}>
            <div className="row">

                <div className="col-md-4 form-group-sm">
                <label>recensionFromDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "recensionFromDate")}
                        
                        selected=
                        {
                            (self.state.editingRecension && self.state.editingRecension.recensionFromDate) ? 
                                moment(self.state.editingRecension.recensionFromDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingRecension && self.state.editingRecension.recensionFromDate == null && self.state.editingRecension[self.state.attrs["recensionFromDate"]]) ?
                                    moment(self.state.editingRecension[self.state.attrs["recensionFromDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

                <div className="col-md-4 form-group-sm">
                <label>recensionMeetingDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "recensionMeetingDate")}
                        
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
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "recensionIssuedDate")}
                        
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
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "recensionToDate")}
                        
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
                        onChange={self._onChange.bind(this, 'recensionChairPosition')}

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
                        onChange={self._onChange.bind(this, 'recensionChairPerson')}

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
                        onChange={self._onSelectChange.bind(this, "recensionStatus")}                    
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
                    {self.state.editingRecensionUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">
                    <Button bsStyle="default" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = RecensionForm;