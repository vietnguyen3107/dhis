var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var DisciplineStore = require("../stores/discipline-store");
var DisciplineActions = require("../actions/discipline-actions");


    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var DisciplineForm = React.createClass({
    _onClickAdd: function() {        
        DisciplineActions.addDiscipline(this.state.editingDiscipline);
    },
    _onClickUpdate: function() {
        DisciplineActions.updateDiscipline(this.state.editingDiscipline);
    }, 
    _onClickClear: function() {
        this.setState({
            editingDiscipline: null,
            editingPersonUid: null,
            editingDisciplineUid: null
        });
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingDiscipline == null ){
            this.state.editingDiscipline = {};
        }
        if(this.state.editingDiscipline[attr] == null){
            this.state.editingDiscipline[attr] = {};
            this.state.editingDiscipline[attr].value = val;
            this.state.editingDiscipline[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingDiscipline[attr].value = val;
        }
    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingDiscipline == null ){
            this.state.editingDiscipline = {};
        }
        if(this.state.editingDiscipline[attr] == null){
            this.state.editingDiscipline[attr] = {};
            this.state.editingDiscipline[attr].value = val;
            this.state.editingDiscipline[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingDiscipline[attr].value = val;
        }

    },
    _onChange: function(attr, e) {

        if(this.state.editingDiscipline == null ){
            this.state.editingDiscipline = {};
        }
        if(this.state.editingDiscipline[attr] == null){
            this.state.editingDiscipline[attr] = {};
            this.state.editingDiscipline[attr].value = e.target.value;
            this.state.editingDiscipline[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingDiscipline[attr].value = e.target.value;
        }
        this.setState({
            editingDiscipline: this.state.editingDiscipline,
        });
        
    },
    _onEdit: function() {
        var editingDiscipline = DisciplineStore.getEditingDiscipline();

		if (this.isMounted()) {
			if(editingDiscipline && editingDiscipline.event ){
				this.setState({
					editingDiscipline: editingDiscipline,
					editingDisciplineUid: editingDiscipline.event.value
				});
			}else{
				this.setState({
					editingDisciplineUid: null,
					editingDiscipline: null,
				});
			}
        }
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingDiscipline: null,
            editingPersonUid : null,
            editingDisciplineUid : null,
            DisciplineTimes: [],
            hospitalTypes: [],
            standardHospitals: [],
	
        }
    },
    componentDidMount: function() {
        DisciplineStore.addEditListenerDiscipline(this._onEdit);
        DisciplineStore.addChangeListenerDiscipline(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/disciplineAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
        //disciplinaryTypes
        $.get("../../../../dhis/api/optionSets/mWgYX8VYkAJ?" + _config.optionFieldSearch, function (xml){
            
            var disciplinaryTypes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                disciplinaryTypes.push(opt);
                
            });

            self.setState({disciplinaryTypes: disciplinaryTypes});
            
        });
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="info" bsSize="sm" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="info" bsSize="sm"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
			
			<div className="row">
                <div className="col-md-4  form-group-sm">
                    <label>disciplineDate*</label>  
					<DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "disciplineDate")}
                        
                        selected=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.disciplineDate) ? 
                                moment(self.state.editingDiscipline.disciplineDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.disciplineDate == null && self.state.editingDiscipline[self.state.attrs["disciplineDate"]]) ?
                                    moment(self.state.editingDiscipline[self.state.attrs["disciplineDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>

                    
                </div>

                <div className="col-md-4  form-group-sm">
                    <label>disciplineSigner</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'disciplineSigner')}
                        value=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.disciplineSigner) ? 
                                self.state.editingDiscipline.disciplineSigner.value : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.disciplineSigner == null && self.state.editingDiscipline[self.state.attrs["disciplineSigner"]]) ?
                                        self.state.editingDiscipline[self.state.attrs["disciplineSigner"]].value  : "")
                        }
                    />

                </div>
				
				<div className="col-md-4  form-group-sm">
                    <label>disciplinaryType*</label>  


					<SimpleSelect
                        name="disciplinaryType"    
                        onChange={self._onSelectChange.bind(this, "disciplinaryType")}                    
                        options={self.state.disciplinaryTypes}
                        value=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.disciplinaryType) ? 
                                self.state.editingDiscipline.disciplinaryType.value : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.disciplinaryType == null && self.state.editingDiscipline[self.state.attrs["disciplinaryType"]]) ?
                                        self.state.editingDiscipline[self.state.attrs["disciplinaryType"]].value  : "")
                        }
					></SimpleSelect>
                    
                </div>


            </div>
			
            <div className="row">

                <div className="col-md-6 form-group-sm">
                <label>fromDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "fromDate")}
                        
                        selected=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.fromDate) ? 
                                moment(self.state.editingDiscipline.fromDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.fromDate == null && self.state.editingDiscipline[self.state.attrs["fromDate"]]) ?
                                    moment(self.state.editingDiscipline[self.state.attrs["fromDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

                <div className="col-md-6 form-group-sm">
                <label>toDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "toDate")}
                        
                        selected=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.toDate) ? 
                                moment(self.state.editingDiscipline.toDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.toDate == null && self.state.editingDiscipline[self.state.attrs["toDate"]]) ?
                                    moment(self.state.editingDiscipline[self.state.attrs["toDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>


            </div>
            <div className="row">

                <div className="col-md-12  form-group-sm">
                    <label>content</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'content')}
                        value=
                        {
                            (self.state.editingDiscipline && self.state.editingDiscipline.content) ? 
                                self.state.editingDiscipline.content.value : 
                                ((self.state.editingDiscipline && self.state.editingDiscipline.content == null && self.state.editingDiscipline[self.state.attrs["content"]]) ?
                                        self.state.editingDiscipline[self.state.attrs["content"]].value  : "")
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
                    {self.state.editingDisciplineUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">
                    <Button bsStyle="sm" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = DisciplineForm;