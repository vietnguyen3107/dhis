var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var EducationStore = require("../stores/education-store");
var EducationActions = require("../actions/education-actions");

var EducationForm = React.createClass({
    _onClickAdd: function() {        
        EducationActions.addEducation(this.state.editingEducation);
    },
    _onClickUpdate: function() {
        EducationActions.updateEducation(this.state.editingEducation);
    }, 
    _onClickClear: function() {
        this.setState({
            editingEducation: null,
            editingPersonUid: null,
            editingEducationUid: null
        });
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingEducation == null ){
            this.state.editingEducation = {};
        }
        if(this.state.editingEducation[attr] == null){
            this.state.editingEducation[attr] = {};
            this.state.editingEducation[attr].value = val;
            this.state.editingEducation[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingEducation[attr].value = val;
        }

        console.log(this.state.editingEducation);


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingEducation == null ){
            this.state.editingEducation = {};
        }
        if(this.state.editingEducation[attr] == null){
            this.state.editingEducation[attr] = {};
            this.state.editingEducation[attr].value = val;
            this.state.editingEducation[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingEducation[attr].value = val;
        }

        console.log(this.state.editingEducation);


    },
    _onChange: function(attr, e) {

        if(this.state.editingEducation == null ){
            this.state.editingEducation = {};
        }
        if(this.state.editingEducation[attr] == null){
            this.state.editingEducation[attr] = {};
            this.state.editingEducation[attr].value = e.target.value;
            this.state.editingEducation[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingEducation[attr].value = e.target.value;
        }
        this.setState({
            editingEducation: this.state.editingEducation,
        });
        
    },
    _onEdit: function() {
        var editingEducation = EducationStore.getEditingEducation();

        if(editingEducation && editingEducation.event ){
            this.setState({
                editingEducation: editingEducation,
                editingEducationUid: editingEducation.event.value
            });
        }else{
            this.setState({
                editingEducationUid: null,
                editingEducation: null,
            });
        }
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingEducation: null,
            editingPersonUid : null,
            editingEducationUid : null,
            forms: [],
            degrees: [],
        }
    },
    componentDidMount: function() {
        EducationStore.addEditListener(this._onEdit);
        EducationStore.addChangeListener(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/educationAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
        //degree
        $.get("../../../../dhis/api/optionSets/ZOsC9S87ap9", function (xml){
            
            var degrees = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                degrees.push(opt);
                
            });

            self.setState({degrees: degrees});
            
        });
        //form
        $.get("../../../../dhis/api/optionSets/mu6CoLtljh2", function (xml){
            
            var forms = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                forms.push(opt);
                
            });

            self.setState({forms: forms});
            
        });
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="success" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="success"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-6">
                    <label>degreeNo</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'degreeNo')}

                        value=
                        {
                            (self.state.editingEducation && self.state.editingEducation.degreeNo) ? 
                                self.state.editingEducation.degreeNo.value : 
                                ((self.state.editingEducation && self.state.editingEducation.degreeNo == null && self.state.editingEducation[self.state.attrs["degreeNo"]]) ?
                                        self.state.editingEducation[self.state.attrs["degreeNo"]].value  : "")
                        }
                    />
                        
                </div>

                <div className="col-md-6 form-group-sm">
                <label>conferDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "conferDate")}
                        
                        selected=
                        {
                            (self.state.editingEducation && self.state.editingEducation.conferDate) ? 
                                moment(self.state.editingEducation.conferDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingEducation && self.state.editingEducation.conferDate == null && self.state.editingEducation[self.state.attrs["conferDate"]]) ?
                                    moment(self.state.editingEducation[self.state.attrs["conferDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>


            </div>
            <div className="row">
                <div className="col-md-6  form-group-sm">
                    <label>startDate*</label>                
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "startDate")}
                        
                        selected=
                        {
                            (self.state.editingEducation && self.state.editingEducation.startDate) ? 
                                moment(self.state.editingEducation.startDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingEducation && self.state.editingEducation.startDate == null && self.state.editingEducation[self.state.attrs["startDate"]]) ?
                                    moment(self.state.editingEducation[self.state.attrs["startDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>
                </div>

                <div className="col-md-6  form-group-sm">
                    <label>endDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "endDate")}                   

                        selected=
                        {
                            (self.state.editingEducation && self.state.editingEducation.endDate) ? 
                                moment(self.state.editingEducation.endDate.value, "YYYY-MM-DD") : 
                                ((self.state.editingEducation && self.state.editingEducation.endDate == null && self.state.editingEducation[self.state.attrs["endDate"]]) ?
                                    moment(self.state.editingEducation[self.state.attrs["endDate"]].value, "YYYY-MM-DD")   : null)
                        }
                    ></DatePicker>

                </div>


            </div>
            <div className="row">

                <div className="col-md-12 ">
                    <label>standardSchool</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'standardSchool')}
                        value=
                        {
                            (self.state.editingEducation && self.state.editingEducation.standardSchool) ? 
                                self.state.editingEducation.standardSchool.value : 
                                ((self.state.editingEducation && self.state.editingEducation.standardSchool == null && self.state.editingEducation[self.state.attrs["standardSchool"]]) ?
                                        self.state.editingEducation[self.state.attrs["standardSchool"]].value  : "")
                        }
                    />
                </div>

            </div>
            <div className="row">

                <div className="col-md-12">
                <label>schoolText</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'schoolText')}
                    value=
                        {
                            (self.state.editingEducation && self.state.editingEducation.schoolText) ? 
                                self.state.editingEducation.schoolText.value : 
                                ((self.state.editingEducation && self.state.editingEducation.schoolText == null && self.state.editingEducation[self.state.attrs["schoolText"]]) ?
                                        self.state.editingEducation[self.state.attrs["schoolText"]].value  : "")
                        }
                    />
                </div>

            </div>
            <div className="row">

                <div className="col-md-6 form-group-sm">
                <label>degree*</label>
                <SimpleSelect
                        name="degree"    
                        onChange={self._onSelectChange.bind(this, "degree")}                    
                        options={self.state.degrees}
                        value=
                        {
                            (self.state.editingEducation && self.state.editingEducation.degree) ? 
                                self.state.editingEducation.degree.value : 
                                ((self.state.editingEducation && self.state.editingEducation.degree == null && self.state.editingEducation[self.state.attrs["degree"]]) ?
                                        self.state.editingEducation[self.state.attrs["degree"]].value  : "")
                        }
                ></SimpleSelect>

                   
                </div>


                <div className="col-md-6">
                    <label>form</label>
                    <SimpleSelect
                        name="form"    
                        onChange={self._onSelectChange.bind(this, "form")}                    
                        options={self.state.forms}
                        value=
                        {
                            (self.state.editingEducation && self.state.editingEducation.form) ? 
                                self.state.editingEducation.form.value : 
                                ((self.state.editingEducation && !self.state.editingEducation.form && self.state.editingEducation[self.state.attrs["form"]]) ?
                                        self.state.editingEducation[self.state.attrs["form"]].value  : "")
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
                    {self.state.editingEducationUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">
                    <Button bsStyle="default" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = EducationForm;