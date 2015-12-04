var React = require("react");

var EducationActions = require("../actions/education-actions");

var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var EducationStore = require("../stores/education-store");

var EducationForm = React.createClass({
    _onClickAdd: function() {        
        EducationActions.addEducation(this.state.editingObj);
    },
    _onClickUpdate: function() {
       
    }, 
    _onClickClear: function() {
        this.setState({
            editingObj: null,
            editingPersonUid: null
        });
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingObj == null ){
            this.state.editingObj = {};
        }
        if(this.state.editingObj[attr] == null){
            this.state.editingObj[attr] = {};
            this.state.editingObj[attr].value = val;
            this.state.editingObj[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingObj[attr].value = val;
        }

        console.log(this.state.editingObj);


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingObj == null ){
            this.state.editingObj = {};
        }
        if(this.state.editingObj[attr] == null){
            this.state.editingObj[attr] = {};
            this.state.editingObj[attr].value = val;
            this.state.editingObj[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingObj[attr].value = val;
        }

        console.log(this.state.editingObj);


    },
    _onChange: function(attr, e) {

        if(this.state.editingObj == null ){
            this.state.editingObj = {};
        }
        if(this.state.editingObj[attr] == null){
            this.state.editingObj[attr] = {};
            this.state.editingObj[attr].value = e.target.value;
            this.state.editingObj[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingObj[attr].value = e.target.value;
        }
        this.setState({
            editingObj: this.state.editingObj,
        });
        
    },
    _onEdit: function() {
        var editingObj = EducationStore.getEditingEducation();

        this.setState({
            editingObj: editingObj
        });
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingObj: null,
            editingPersonUid : null,
            forms: [],
            degrees: [],
        }
    },
    componentDidMount: function() {
        
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
                        value={(self.state.editingObj == null ||  self.state.editingObj.degreeNo == null) ? 
                            "" : self.state.editingObj.degreeNo.value}  />

                </div>

                <div className="col-md-6 form-group-sm">
                <label>conferDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "conferDate")}
                        selected={(self.state.editingObj && self.state.editingObj.conferDate) ? moment(self.state.editingObj.conferDate.value, "YYYY-MM-DD") : null}
                    ></DatePicker>
                </div>


            </div>
            <div className="row">
                <div className="col-md-6  form-group-sm">
                    <label>startDate*</label>                
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "startDate")}
                        selected={(self.state.editingObj && self.state.editingObj.startDate) ? 
                            moment(self.state.editingObj.startDate.value, "YYYY-MM-DD") : null}
                    ></DatePicker>
                </div>

                <div className="col-md-6  form-group-sm">
                    <label>endDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "endDate")}
                        selected={(self.state.editingObj && self.state.editingObj.endDate) ? 
                            moment(self.state.editingObj.endDate.value, "YYYY-MM-DD") : null}
                    ></DatePicker>

                </div>


            </div>
            <div className="row">

                <div className="col-md-12 ">
                    <label>standardSchool</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'standardSchool')}
                        value={(self.state.editingObj == null ||  self.state.editingObj.standardSchool == null) ? 
                            "" : self.state.editingObj.standardSchool.value}  />

                </div>

            </div>
            <div className="row">

                <div className="col-md-12">
                <label>schoolText</label>
                    <Input type="text" bsSize="small" 
                    onChange={self._onChange.bind(this, 'schoolText')}
                    value={(self.state.editingObj == null ||  self.state.editingObj.schoolText == null) ? 
                        "" : self.state.editingObj.schoolText.value }  />
                </div>

            </div>
            <div className="row">

                <div className="col-md-6 form-group-sm">
                <label>degree*</label>
                <SimpleSelect
                        name="degree"    
                        onChange={self._onSelectChange.bind(this, "degree")}                    
                        options={self.state.degrees}
                        value={(self.state.editingObj == null ||  self.state.editingObj.degree == null) ? 
                            "" : self.state.editingObj.degree.value}                  
                ></SimpleSelect>

                   
                </div>


                <div className="col-md-6">
                    <label>form</label>
                    <SimpleSelect
                        name="form"    
                        onChange={self._onSelectChange.bind(this, "form")}                    
                        options={self.state.forms}
                        value={(self.state.editingObj == null ||  self.state.editingObj.form == null) ? 
                            "" : self.state.editingObj.form.value}                  
                ></SimpleSelect>
                </div>

            </div>
            <div className="row">
                <div className="col-md-12">
                   
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <label>&nbsp;</label>
                    <div  className="pull-right">
                    {self.state.editingPersonUid ? btnUpdate : btnAdd}
                    <Button bsStyle="default" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = EducationForm;