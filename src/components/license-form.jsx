var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var LicenseStore = require("../stores/license-store");
var LicenseActions = require("../actions/license-actions");

    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var LicenseForm = React.createClass({
    _onClickAdd: function() {        
        LicenseActions.addLicense(this.state.editingLicense);
    },
    _onClickUpdate: function() {
        LicenseActions.updateLicense(this.state.editingLicense);
    }, 
    _onClickClear: function() {
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingLicense == null ){
            this.state.editingLicense = {};
        }
        if(this.state.editingLicense[attr] == null){
            this.state.editingLicense[attr] = {};
            this.state.editingLicense[attr].value = val;
            this.state.editingLicense[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingLicense[attr].value = val;
        }


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingLicense == null ){
            this.state.editingLicense = {};
        }
        if(this.state.editingLicense[attr] == null){
            this.state.editingLicense[attr] = {};
            this.state.editingLicense[attr].value = val;
            this.state.editingLicense[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingLicense[attr].value = val;
        }



    },
    _onChange: function(attr, e) {

        if(this.state.editingLicense == null ){
            this.state.editingLicense = {};
        }
        if(this.state.editingLicense[attr] == null){
            this.state.editingLicense[attr] = {};
            this.state.editingLicense[attr].value = e.target.value;
            this.state.editingLicense[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingLicense[attr].value = e.target.value;
        }
        this.setState({
            editingLicense: this.state.editingLicense,
        });
        
    },
    _onEdit: function() {
        
		
		var editingLicense = LicenseStore.getEditingLicense();

		if (this.isMounted()) {
			if(editingLicense && editingLicense.event ){
				this.setState({
					editingLicense: editingLicense,
					editingLicenseUid: editingLicense.event.value
				});
			}else{
				this.setState({
					editingLicenseUid: null,
					editingLicense: null,
				});
			}
		}
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingLicense: null,
            editingPersonUid : null,
            editingLicenseUid : null,
            forms: [],
            degrees: [],
        }
    },
    componentDidMount: function() {
        LicenseStore.addEditListener(this._onEdit);
        LicenseStore.addChangeListener(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/licenseAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
        //licensestatus
        $.get("../../../../dhis/api/optionSets/jmzS0ebdZ5R?" + _config.optionFieldSearch, function (xml){
            
            var licenseStatuses = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                licenseStatuses.push(opt);
                
            });

            self.setState({licenseStatuses: licenseStatuses});
            
        });
        
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="primary" bsSize="sm" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="primary" bsSize="sm"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-4">
                    <label>licenseCode</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'licenseCode')}

                        value=
                        {
                            (self.state.editingLicense && self.state.editingLicense.licenseCode) ? 
                                self.state.editingLicense.licenseCode.value : 
                                ((self.state.editingLicense && self.state.editingLicense.licenseCode == null && self.state.editingLicense[self.state.attrs["licenseCode"]]) ?
                                        self.state.editingLicense[self.state.attrs["licenseCode"]].value  : "")
                        }
                    />
                        
                </div>

                <div className="col-md-4 form-group-sm">
                <label>issuedDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "issuedDate")}
                        
                        selected=
                        {
                            (self.state.editingLicense && self.state.editingLicense.issuedDate) ? 
                                moment(self.state.editingLicense.issuedDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingLicense && self.state.editingLicense.issuedDate == null && self.state.editingLicense[self.state.attrs["issuedDate"]]) ?
                                    moment(self.state.editingLicense[self.state.attrs["issuedDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>
				
				<div className="col-md-4 form-group-sm">
					<label>meetingDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "meetingDate")}
                        
                        selected=
                        {
                            (self.state.editingLicense && self.state.editingLicense.meetingDate) ? 
                                moment(self.state.editingLicense.meetingDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingLicense && self.state.editingLicense.meetingDate == null && self.state.editingLicense[self.state.attrs["meetingDate"]]) ?
                                    moment(self.state.editingLicense[self.state.attrs["meetingDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>issuedPlace</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'issuedPlace')}

                        value=
                        {
                            (self.state.editingLicense && self.state.editingLicense.issuedPlace) ? 
                                self.state.editingLicense.issuedPlace.value : 
                                ((self.state.editingLicense && self.state.editingLicense.issuedPlace == null && self.state.editingLicense[self.state.attrs["issuedPlace"]]) ?
                                        self.state.editingLicense[self.state.attrs["issuedPlace"]].value  : "")
                        }
                    />
                        
                </div>
                <div className="col-md-4">
                    <label>signer</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'signer')}

                        value=
                        {
                            (self.state.editingLicense && self.state.editingLicense.signer) ? 
                                self.state.editingLicense.signer.value : 
                                ((self.state.editingLicense && self.state.editingLicense.signer == null && self.state.editingLicense[self.state.attrs["signer"]]) ?
                                        self.state.editingLicense[self.state.attrs["signer"]].value  : "")
                        }
                    />
                        
                </div>
                <div className="col-md-4">
                    <label>signerPosition</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'signerPosition')}

                        value=
                        {
                            (self.state.editingLicense && self.state.editingLicense.signerPosition) ? 
                                self.state.editingLicense.signerPosition.value : 
                                ((self.state.editingLicense && self.state.editingLicense.signerPosition == null && self.state.editingLicense[self.state.attrs["signerPosition"]]) ?
                                        self.state.editingLicense[self.state.attrs["signerPosition"]].value  : "")
                        }
                    />
                        
                </div>


            </div>
            <div className="row">

		

                <div className="col-md-4 form-group-sm">
                <label>licenseStatus*</label>
                <SimpleSelect
                        name="licenseStatus"    
                        onChange={self._onSelectChange.bind(this, "licenseStatus")}                    
                        options={self.state.licenseStatuses}
                        value=
                        {
                            (self.state.editingLicense && self.state.editingLicense.licenseStatus) ? 
                                self.state.editingLicense.licenseStatus.value : 
                                ((self.state.editingLicense && self.state.editingLicense.licenseStatus == null && self.state.editingLicense[self.state.attrs["licenseStatus"]]) ?
                                        self.state.editingLicense[self.state.attrs["licenseStatus"]].value  : "")
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
                    {self.state.editingLicenseUid ? btnUpdate : btnAdd}
                   
                </div>
            </div>

            </form>
        );
    }
});

module.exports = LicenseForm;