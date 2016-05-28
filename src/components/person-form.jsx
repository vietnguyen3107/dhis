var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var DisciplineStore = require("../stores/discipline-store");
var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var attrs = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "data/licensingAttributes.json",
        async: false
    }).responseText);

    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var PersonForm = React.createClass({
    _onClickAdd: function() {
		
		if(this.state.editingPerson.orgUnit == null){
			this.state.editingPerson.orgUnit = {val: this.props.orgUnitUid};
		}
        PersonActions.addPerson(this.state.editingPerson);

    },
    _onClickUpdate: function() {
        var editingPerson = this.state.editingPerson;
        PersonActions.updatePerson(editingPerson);
    },
    _onClickClear: function() {
        PersonActions.clearPerson();
        this.setState({
            editingPerson: null,
            editingPersonUid: null
        });
    },
    _onChangeName: function(e) {
        var ePerson = this.state.editingPerson;
        ePerson["firstName"] = e.target.value;
        this.setState({
            editingPerson: ePerson,
        });
    },
    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingPerson == null ){
            this.state.editingPerson = {};
        }
        if(this.state.editingPerson[attr] == null){
            this.state.editingPerson[attr] = {};
            this.state.editingPerson[attr].value = val;
            this.state.editingPerson[attr].uid = attrs[attr];

        }else{
            this.state.editingPerson[attr].value = val;
        }



    },

    _onDatePickerChange: function(attr, val, e){
        val = val.format("DD/MM/YYYY");
        console.log("attr = " +attr);
        console.log("val = " +val);
       
        if(this.state.editingPerson == null ){
            this.state.editingPerson = {};
        }
        if(this.state.editingPerson[attr] == null){
            this.state.editingPerson[attr] = {};
            this.state.editingPerson[attr].value = val;
            this.state.editingPerson[attr].uid = attrs[attr];

        }else{
            this.state.editingPerson[attr].value = val;
        }

        console.log(this.state.editingPerson);


    },
    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
        console.log("attr = " +attr);
        console.log("val = " +val);
       
        if(this.state.editingPerson == null ){
            this.state.editingPerson = {};
        }
        if(this.state.editingPerson[attr] == null){
            this.state.editingPerson[attr] = {};
            this.state.editingPerson[attr].value = val;
            this.state.editingPerson[attr].uid = attrs[attr];

        }else{
            this.state.editingPerson[attr].value = val;
        }

        console.log(this.state.editingPerson);


    },
    _onChange: function(attr, e) {

        if(this.state.editingPerson == null ){
            this.state.editingPerson = {};
        }
        if(this.state.editingPerson[attr] == null){
            this.state.editingPerson[attr] = {};
            this.state.editingPerson[attr].value = e.target.value;
            this.state.editingPerson[attr].uid = attrs[attr];

        }else{
            this.state.editingPerson[attr].value = e.target.value;
        }
        this.setState({
            editingPerson: this.state.editingPerson,
        });
        
    },
    _onEdit: function() {
        var editingPerson = PersonStore.getEditingPerson();
		if (this.isMounted()) {
        this.setState({
            editingPerson: editingPerson,
            editingPersonUid: editingPerson.instance.value
        });
		}
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingPerson: null,
            editingPersonUid : null,
            countries: [],
            disciplines: [],
            applicationTypes: [],
        }
    },
    componentDidMount: function() {
        PersonStore.addEditPersonListener(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;
        
        //recensions
        $.get("../../../../dhis/api/optionSets/EBYskOSmXH5?" + _config.optionFieldSearch, function (xml){
            
            var recensions = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                recension = {};
                recension.value = entry.code;
                recension.label = entry.name;

                recensions.push(recension);
                
            });

            self.setState({recensions: recensions});
            
        });
        //applicationType
        $.get("../../../../dhis/api/optionSets/FQS1S2NwFyC?" + _config.optionFieldSearch, function (xml){
            
            var applicationTypes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                applicationType = {};
                applicationType.value = entry.code;
                applicationType.label = entry.name;

                applicationTypes.push(applicationType);
                
            });

            self.setState({applicationTypes: applicationTypes});
            
        });
		 //applicationStatus
        $.get("../../../../dhis/api/optionSets/SCj9vq6xzYz?" + _config.optionFieldSearch, function (xml){
            
            var applicationStatuses = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                applicationStatus = {};
                applicationStatus.value = entry.code;
                applicationStatus.label = entry.name;

                applicationStatuses.push(applicationStatus);
                
            });

            self.setState({applicationStatuses: applicationStatuses});
            
        });
        //disciplines
        $.get("../../../../dhis/api/optionSets/vLyLsFHBomG?" + _config.optionFieldSearch, function (xml){
            
            var disciplines = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                discipline = {};
                discipline.value = entry.code;
                discipline.label = entry.name;

                disciplines.push(discipline);
                
            });

            self.setState({disciplines: disciplines});
            
        });
        //nationality
        $.getJSON("data/countries.json").done(function(nationalities){
            self.setState({nationalities: nationalities});
        });


        self.setState(
            {
                genders: 
                [
                    {value: '19933', label: 'Female'}, 
                    {value: '19934', label: 'Male'},
                ],
                                

            }
        );
    },
	componentWillUnmount: function(){
		console.log("test unmoiunt");
	},
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="info" bsSize="sm" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="info" bsSize="sm"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-4">
                    <label>hospitalCode</label>
                    <Input type="text" bsSize="small"
                        
                        onChange={self._onChange.bind(this, 'hospitalCode')}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.hospitalCode == null) ? "" : self.state.editingPerson.hospitalCode.value}  />

                </div>

                <div className="col-md-4">
                <label>appCode</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'appCode')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.appCode == null) ? "" : self.state.editingPerson.appCode.value }  />
                </div>

                <div className="col-md-4 form-group-sm">
                <label>appDate*</label>                
                    <DatePicker className="form-control"
                        bsSize="small"
                        selected={(self.state.editingPerson && self.state.editingPerson.created) ? moment(self.state.editingPerson.created.value) : null}
                        dateFormat= "DD/MM/YYYY"
                    />
                </div>

            </div>

            <div className="row">

                <div className="col-md-4">
                <label className="col2">Nơi cấp</label>
                </div>

                <div className="col-md-4  form-group-sm" >
                    <label className="col2">Discipline</label>
                    <SimpleSelect
                        name="discipline"
                        onChange={self._onSelectChange.bind(this, "discipline")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.discipline == null) ? "" : self.state.editingPerson.discipline.value}
                        options={self.state.disciplines}
                
                    />
          
 
                </div>

                <div className="col-md-4 form-group-sm">
                    <label>applicationType*</label>
                    <SimpleSelect
                        name="applicationType"    
                        onChange={self._onSelectChange.bind(this, "applicationType")}                    
                        options={self.state.applicationTypes}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.applicationType == null) ? "" : self.state.editingPerson.applicationType.value}
                       
                
                    />
                </div>


            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>recipientName</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'recipientName')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.recipientName == null) ? "" : self.state.editingPerson.recipientName.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>recipientPosition</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'recipientPosition')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.recipientPosition == null) ? "" : self.state.editingPerson.recipientPosition.value}/>
                </div>
                <div className="col-md-4">
                    <label>IssuedPlace</label>
                    <Input type="text" bsSize="small"  
                    onChange={self._onChange.bind(this, 'lblIssuedPlace')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.lblIssuedPlace == null) ? "" : self.state.editingPerson.lblIssuedPlace.value}/>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>procesedBy</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'procesedBy')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.procesedBy == null) ? "" : self.state.editingPerson.procesedBy.value}/>
                </div>
                <div className="col-md-4 form-group-sm">
                    <label>recension*</label>
                    <SimpleSelect
                        name="recension"    
                        onChange={self._onSelectChange.bind(this, "recension")}                    
                        options={self.state.recensions}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.recension == null) ? "" : self.state.editingPerson.recension.value}
                       
                
                    />
                </div>
                <div className="col-md-4">
                    <label></label>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>firstName*</label>
                    <Input type="text" bsSize="small" 
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.firstName == null) ? "" : self.state.editingPerson.firstName.value} 
                        onChange={self._onChange.bind(this, 'firstName')} />
                </div>
                <div className="col-md-4 form-group-sm">
                    <label>Gender</label>
                    <SimpleSelect
                        placeholder = "gender"
                        options = {self.state.genders}

                        onChange={self._onSelectChange.bind(this, "gender")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.gender == null) ? "19933" : self.state.editingPerson.gender.value}
                    />
                </div>
                <div className="col-md-4 form-group-sm">
                    <label>Birthday*</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChange.bind(this, "birthday")}
                        selected={(self.state.editingPerson && self.state.editingPerson.birthday) ? moment(self.state.editingPerson.birthday.value, "DD/MM/YYYY") : null}
                        
                    />
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>BirthPlace</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'birthdayPlace')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.birthdayPlace == null) ? "" : self.state.editingPerson.birthdayPlace.value}/>
                
                </div>
                <div className="col-md-4 form-group-sm">
                    <label>nationlityText</label>
                    <SimpleSelect
                        placeholder = "nationlityText"
                        options = {self.state.nationalities}
                        onChange={self._onSelectChange.bind(this, "nationlityText")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.nationlityText == null) ? "vn" : self.state.editingPerson.nationlityText.value}
                    />
                </div>
                <div className="col-md-4">
                    <label>ethnicText</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'ethnicText')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.ethnicText == null) ? "" : self.state.editingPerson.ethnicText.value}/>
                
                </div>

            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>peopleIndentity</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'peopleIndentity')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.peopleIndentity == null) ? "" : self.state.editingPerson.peopleIndentity.value}/>
                
                </div>
                <div className="col-md-4 form-group-sm">
                    <label>idIssuedDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "idIssuedDate")}
                        selected={(self.state.editingPerson && self.state.editingPerson.idIssuedDate) ? moment(self.state.editingPerson.idIssuedDate.value, "YYYY-MM-DD") : null}
                    ></DatePicker>

                
                </div>
                <div className="col-md-4">
                    <label>idIssuedPlaceText</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'idIssuedPlaceText')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.idIssuedPlaceText == null) ? "" : self.state.editingPerson.idIssuedPlaceText.value}/>
                
                </div>
            </div>
            <div className="row">

                <div className="col-md-4">
                    <label>tempAddress</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'tempAddress')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempAddress == null) ? "" : self.state.editingPerson.tempAddress.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempProvince</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'tempProvince')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempProvince == null) ? "" : self.state.editingPerson.tempProvince.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempDistrict</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'tempDistrict')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempDistrict == null) ? "" : self.state.editingPerson.tempDistrict.value}/>
                
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>tempWard</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'tempWard')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempWard == null) ? "" : self.state.editingPerson.tempWard.value}/>
                
                </div>

                <div className="col-md-4">
                    <label>email</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'email')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.email == null) ? "" : self.state.editingPerson.email.value}/>
                </div>
                <div className="col-md-4">
                    <label>mobilePhone</label>
                    <Input type="text"
                    onChange={self._onChange.bind(this, 'mobilePhone')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.mobilePhone == null) ? "" : self.state.editingPerson.mobilePhone.value}/>
                </div>
				
				
                <div className="col-md-4 form-group-sm">
                    <label>applicationStatus</label>
                    <SimpleSelect
                        name="applicationStatus"    
                        onChange={self._onSelectChange.bind(this, "applicationStatus")}                    
                        options={self.state.applicationStatuses}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.applicationStatus == null) ? "" : self.state.editingPerson.applicationStatus.value}
                       
                
                    />
                </div>
            </div>


          
            <div className="row">
                <div className="col-md-12 pull-right">
                    {self.state.editingPersonUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">                    
                        <Button bsStyle="default" onClick={self._onClickClear}>Clear</Button>                
                    
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = PersonForm;