var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var ExperienceStore = require("../stores/experience-store");
var ExperienceActions = require("../actions/experience-actions");


    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
	
var ExperienceForm = React.createClass({
    _onClickAdd: function() {        
        ExperienceActions.addExperience(this.state.editingExperience);
    },
    _onClickUpdate: function() {
        ExperienceActions.updateExperience(this.state.editingExperience);
    }, 
    _onClickClear: function() {
        this.setState({
            editingExperience: null,
            editingPersonUid: null,
            editingExperienceUid: null
        });
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingExperience == null ){
            this.state.editingExperience = {};
        }
        if(this.state.editingExperience[attr] == null){
            this.state.editingExperience[attr] = {};
            this.state.editingExperience[attr].value = val;
            this.state.editingExperience[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingExperience[attr].value = val;
        }

        console.log(this.state.editingExperience);


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingExperience == null ){
            this.state.editingExperience = {};
        }
        if(this.state.editingExperience[attr] == null){
            this.state.editingExperience[attr] = {};
            this.state.editingExperience[attr].value = val;
            this.state.editingExperience[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingExperience[attr].value = val;
        }

        console.log(this.state.editingExperience);


    },
    _onChange: function(attr, e) {

        if(this.state.editingExperience == null ){
            this.state.editingExperience = {};
        }
        if(this.state.editingExperience[attr] == null){
            this.state.editingExperience[attr] = {};
            this.state.editingExperience[attr].value = e.target.value;
            this.state.editingExperience[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingExperience[attr].value = e.target.value;
        }
        this.setState({
            editingExperience: this.state.editingExperience,
        });
        
    },
    _onEdit: function() {
        var editingExperience = ExperienceStore.getEditingExperience();

		if (this.isMounted()) {
			if(editingExperience && editingExperience.event ){
				this.setState({
					editingExperience: editingExperience,
					editingExperienceUid: editingExperience.event.value
				});
			}else{
				this.setState({
					editingExperienceUid: null,
					editingExperience: null,
				});
			}
		}
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingExperience: null,
            editingPersonUid : null,
            editingExperienceUid : null,
            experienceTimes: [],
            hospitalTypes: [],
            standardHospitals: [],
	
        }
    },
    componentDidMount: function() {
        ExperienceStore.addEditListenerExperience(this._onEdit);
        ExperienceStore.addChangeListenerExperience(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/experienceAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
        //experienceTimes
        $.get("../../../../dhis/api/optionSets/Zd5o5eYGLYM?" + _config.optionFieldSearch, function (xml){
            
            var experienceTimes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                experienceTimes.push(opt);
                
            });

            self.setState({experienceTimes: experienceTimes});
            
        });
        //hospitalTypes
        $.get("../../../../dhis/api/optionSets/JMELgYjQc56?" + _config.optionFieldSearch, function (xml){
            
            var hospitalTypes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                hospitalTypes.push(opt);
                
            });

            self.setState({hospitalTypes: hospitalTypes});
			
            
        });
        //standardHospitals
        $.get("../../../../dhis/api/optionSets/MJZjKc5go2h?" + _config.optionFieldSearch, function (xml){
            
            var standardHospitals = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                standardHospitals.push(opt);
                
            });

            self.setState({standardHospitals: standardHospitals});
			
            
        });
		
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="info" bsSize="sm" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="info" bsSize="sm"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-6 form-group-sm">
                <label>startString</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "startString")}
                        
                        selected=
                        {
                            (self.state.editingExperience && self.state.editingExperience.startString) ? 
                                moment(self.state.editingExperience.startString.value, "YYYY-MM-DD") : 
                                ((self.state.editingExperience && self.state.editingExperience.startString == null && self.state.editingExperience[self.state.attrs["startString"]]) ?
                                    moment(self.state.editingExperience[self.state.attrs["startString"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

                <div className="col-md-6 form-group-sm">
                <label>endString</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "endString")}
                        
                        selected=
                        {
                            (self.state.editingExperience && self.state.editingExperience.endString) ? 
                                moment(self.state.editingExperience.endString.value, "YYYY-MM-DD") : 
                                ((self.state.editingExperience && self.state.editingExperience.endString == null && self.state.editingExperience[self.state.attrs["endString"]]) ?
                                    moment(self.state.editingExperience[self.state.attrs["endString"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>


            </div>
            <div className="row">
                <div className="col-md-12  form-group-sm">
                    <label>standardHospital*</label>  


					<SimpleSelect
                        name="standardHospital"    
                        onChange={self._onSelectChange.bind(this, "standardHospital")}                    
                        options={self.state.standardHospitals}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.standardHospital) ? 
                                self.state.editingExperience.standardHospital.value : 
                                ((self.state.editingExperience && self.state.editingExperience.standardHospital == null && self.state.editingExperience[self.state.attrs["standardHospital"]]) ?
                                        self.state.editingExperience[self.state.attrs["standardHospital"]].value  : "")
                        }
					></SimpleSelect>
                    
                </div>

                <div className="col-md-12  form-group-sm">
                    <label>hospitalExperienceText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'hospitalExperienceText')}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.hospitalExperienceText) ? 
                                self.state.editingExperience.hospitalExperienceText.value : 
                                ((self.state.editingExperience && self.state.editingExperience.hospitalExperienceText == null && self.state.editingExperience[self.state.attrs["hospitalExperienceText"]]) ?
                                        self.state.editingExperience[self.state.attrs["hospitalExperienceText"]].value  : "")
                        }
                    />

                </div>


            </div>

            <div className="row">

                <div className="col-md-4">
                <label>hospitalType</label>
                    <SimpleSelect
                        name="degree"    
                        onChange={self._onSelectChange.bind(this, "hospitalType")}                    
                        options={self.state.hospitalTypes}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.hospitalType) ? 
                                self.state.editingExperience.hospitalType.value : 
                                ((self.state.editingExperience && self.state.editingExperience.hospitalType == null && self.state.editingExperience[self.state.attrs["hospitalType"]]) ?
                                        self.state.editingExperience[self.state.attrs["hospitalType"]].value  : "")
                        }
					></SimpleSelect>
                </div>
				
                <div className="col-md-4">
                <label>departmentText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'departmentText')}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.departmentText) ? 
                                self.state.editingExperience.departmentText.value : 
                                ((self.state.editingExperience && self.state.editingExperience.departmentText == null && self.state.editingExperience[self.state.attrs["departmentText"]]) ?
                                        self.state.editingExperience[self.state.attrs["departmentText"]].value  : "")
                        }
                    />
                </div>
                <div className="col-md-4">
                <label>experienceScopeText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'experienceScopeText')}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.experienceScopeText) ? 
                                self.state.editingExperience.experienceScopeText.value : 
                                ((self.state.editingExperience && self.state.editingExperience.experienceScopeText == null && self.state.editingExperience[self.state.attrs["experienceScopeText"]]) ?
                                        self.state.editingExperience[self.state.attrs["experienceScopeText"]].value  : "")
                        }
                    />
                </div>

            </div>
            <div className="row">

                <div className="col-md-6 form-group-sm">
                <label>experiencePositionText*</label>
                 <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'experiencePositionText')}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.experiencePositionText) ? 
                                self.state.editingExperience.experiencePositionText.value : 
                                ((self.state.editingExperience && self.state.editingExperience.experiencePositionText == null && self.state.editingExperience[self.state.attrs["experiencePositionText"]]) ?
                                        self.state.editingExperience[self.state.attrs["experiencePositionText"]].value  : "")
                        }
                    />

                   
                </div>


                <div className="col-md-6">
                    <label>experienceTime</label>
                    <SimpleSelect
                        name="experienceTime"    
                        onChange={self._onSelectChange.bind(this, "experienceTime")}                    
                        options={self.state.experienceTimes}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.experienceTime) ? 
                                self.state.editingExperience.experienceTime.value : 
                                ((self.state.editingExperience && !self.state.editingExperience.experienceTime && self.state.editingExperience[self.state.attrs["experienceTime"]]) ?
                                        self.state.editingExperience[self.state.attrs["experienceTime"]].value  : "")
                        }

                ></SimpleSelect>

                </div>

            </div>
            <div className="row">
                <div className="col-md-12">
					<label>description*</label>
					<Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'description')}
                        value=
                        {
                            (self.state.editingExperience && self.state.editingExperience.description) ? 
                                self.state.editingExperience.description.value : 
                                ((self.state.editingExperience && self.state.editingExperience.description == null && self.state.editingExperience[self.state.attrs["description"]]) ?
                                        self.state.editingExperience[self.state.attrs["description"]].value  : "")
                        }
                    />

                   
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                   <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {self.state.editingExperienceUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">
                    <Button bsStyle="default" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = ExperienceForm;