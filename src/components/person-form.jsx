var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var DisciplineStore = require("../stores/discipline-store");
var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var moment = require("moment");

var attributeMapping = {
    fullName: "vSS6J7ALd24",
    hospitalCode: "qbj1eozsDbR",
    appCode: "jprl9bjHEro",
    appDate: "jprl9bjHEro",
    appIssuedPlace: "KqQT81iDMcR",
    applicationType: "NQenLV0S1xZ",
    recipientName: "pRqweb0bcdF",
    recipientPosition: "Zod5rBVELxI",
    procesedBy: "Cz07zEg0WNr",
    gender: "cnSMYCtPpJT",
    birthday: "Cn1GmTKfyI7",
    birthdayPlace: "obQAuqzOK8B",
    nationlity: "cC2kE3PC5DJ",
    ethnic: "kTiTyvPu4Dl",
    idtype: "WNaEozOLk3i",
    peopleIndentity: "voQ9uJATcnh",
    idIssuedDate: "eWzlfNtNmyu",
    idIssuedPlaceText: "UfE3b3uQtLl",
    tempAddress: "u4YkJjpPYwq",
    tempProvince: "Nft3hUNX8PY",
    tempDistrict: "B5Wphrj9i8S",
    mobilePhone: "kRCUbNnwADi",
    email: "I3IyXCI5MsB",
    discipline : "KuoPvulbl3f"
}

var PersonForm = React.createClass({
    _onClickAdd: function() {
        PersonActions.addPerson(this.state.editingPerson);

        this.setState({
            fullName: "",
        });
    },
    _onClickUpdate: function() {
        var editingPerson = this.state.editingPerson;
        PersonActions.updatePerson(editingPerson);
    },
    _onClickClear: function() {
        this.setState({
            editingPerson: null,
            editingPersonUid: null
        });
    },
    _onChangeName: function(e) {
        var ePerson = this.state.editingPerson;
        ePerson["fullName"] = e.target.value;
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
            this.state.editingPerson[attr].uid = attributeMapping[attr];

        }else{
            this.state.editingPerson[attr].value = val;
        }

        console.log(this.state.editingPerson);


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
            this.state.editingPerson[attr].uid = attributeMapping[attr];

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
            this.state.editingPerson[attr].uid = attributeMapping[attr];

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
            this.state.editingPerson[attr].uid = attributeMapping[attr];

        }else{
            this.state.editingPerson[attr].value = e.target.value;
        }
        this.setState({
            editingPerson: this.state.editingPerson,
        });
        
    },
    _onEdit: function() {
        var editingPerson = PersonStore.getEditingPerson();

        this.setState({
            editingPerson: editingPerson,
            editingPersonUid: editingPerson.instance.value
        });
    },
    getInitialState: function() {
        return {

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
        
        //applicationType
        $.get("../dhis/api/optionSets/FQS1S2NwFyC", function (xml){
            
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
        //disciplines
        $.get("../dhis/api/optionSets/vLyLsFHBomG", function (xml){
            
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
        $.getJSON("http://restverse.com/countries").done(function(nationalities){
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
    render: function() {
        var self = this;
        var btnAdd = (<input type="button" value="Add" className="btn btn-default pull-right" onClick={self._onClickAdd} />);
        var btnUpdate = (<input type="button" value="Update" className="btn btn-default pull-right" onClick={self._onClickUpdate} />);
        
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-4">
                    <label>hospitalCode</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'hospitalCode')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.hospitalCode == null) ? "" : self.state.editingPerson.hospitalCode.value}  />

                </div>

                <div className="col-md-4">
                <label>appCode</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'appCode')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.appCode == null) ? "" : self.state.editingPerson.appCode.value }  />
                </div>

                <div className="col-md-4">
                <label>appDate*</label>                
                    <DatePicker className="form-control"

                        selected={(self.state.editingPerson && self.state.editingPerson.created) ? moment(self.state.editingPerson.created.value) : null}
                        dateFormat= "DD/MM/YYYY"
                    />
                </div>

            </div>

            <div className="row">

                <div className="col-md-4">
                <label className="col2">Nơi cấp</label>
                </div>

                <div className="col-md-4">
                    <label className="col2">Discipline</label>
                    <SimpleSelect
                        name="discipline"
                        onChange={self._onSelectChange.bind(this, "discipline")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.discipline == null) ? "" : self.state.editingPerson.discipline.value}
                        options={self.state.disciplines}
                
                    />
          
 
                </div>

                <div className="col-md-4">
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
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'recipientName')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.recipientName == null) ? "" : self.state.editingPerson.recipientName.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>recipientPosition</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'recipientPosition')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.recipientPosition == null) ? "" : self.state.editingPerson.recipientPosition.value}/>
                </div>
                <div className="col-md-4">
                    <label>IssuedPlace</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'lblIssuedPlace')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.lblIssuedPlace == null) ? "" : self.state.editingPerson.lblIssuedPlace.value}/>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>procesedBy</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'procesedBy')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.procesedBy == null) ? "" : self.state.editingPerson.procesedBy.value}/>
                </div>
                <div className="col-md-4">
                    <label></label>
                </div>
                <div className="col-md-4">
                    <label></label>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>Fullname*</label>
                    <input className="form-control" attr="fullName"
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.fullName == null) ? "" : self.state.editingPerson.fullName.value} 
                        onChange={self._onChange.bind(this, 'fullName')} />
                </div>
                <div className="col-md-4">
                    <label>Gender</label>
                    <SimpleSelect
                        placeholder = "gender"
                        options = {self.state.genders}

                        onChange={self._onSelectChange.bind(this, "gender")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.gender == null) ? "19933" : self.state.editingPerson.gender.value}
                    />
                </div>
                <div className="col-md-4">
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
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'birthdayPlace')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.birthdayPlace == null) ? "" : self.state.editingPerson.birthdayPlace.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>nationlity</label>
                    <SimpleSelect
                        placeholder = "nationlity"
                        options = {self.state.nationalities}
                        onChange={self._onSelectChange.bind(this, "nationlity")}
                        value={(self.state.editingPerson == null ||  self.state.editingPerson.nationlity == null) ? "vn" : self.state.editingPerson.nationlity.value}
                    />
                </div>
                <div className="col-md-4">
                    <label>Ethnic</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'ethnic')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.ethnic == null) ? "" : self.state.editingPerson.ethnic.value}/>
                
                </div>

            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>peopleIndentity</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'peopleIndentity')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.peopleIndentity == null) ? "" : self.state.editingPerson.peopleIndentity.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>idIssuedDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        onChange={self._onDatePickerChangeYYYYMMDD.bind(this, "idIssuedDate")}
                        selected={(self.state.editingPerson && self.state.editingPerson.idIssuedDate) ? moment(self.state.editingPerson.idIssuedDate.value, "YYYY-MM-DD") : null}
                    ></DatePicker>

                
                </div>
                <div className="col-md-4">
                    <label>idIssuedPlaceText</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'idIssuedPlaceText')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.idIssuedPlaceText == null) ? "" : self.state.editingPerson.idIssuedPlaceText.value}/>
                
                </div>
            </div>
            <div className="row">

                <div className="col-md-4">
                    <label>tempAddress</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'tempAddress')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempAddress == null) ? "" : self.state.editingPerson.tempAddress.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempProvince</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'tempProvince')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempProvince == null) ? "" : self.state.editingPerson.tempProvince.value}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempDistrict</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'tempDistrict')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempDistrict == null) ? "" : self.state.editingPerson.tempDistrict.value}/>
                
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>tempWard</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'tempWard')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.tempWard == null) ? "" : self.state.editingPerson.tempWard.value}/>
                
                </div>

                <div className="col-md-4">
                    <label>email</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'email')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.email == null) ? "" : self.state.editingPerson.email.value}/>
                </div>
                <div className="col-md-4">
                    <label>mobilePhone</label>
                    <input className="form-control" 
                    onChange={self._onChange.bind(this, 'mobilePhone')}
                    value={(self.state.editingPerson == null ||  self.state.editingPerson.mobilePhone == null) ? "" : self.state.editingPerson.mobilePhone.value}/>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label></label>
                </div>
                <div className="col-md-4">
                    <label></label>
                </div>
                <div className="col-md-4">
                    <label></label>
                </div>
            </div>

          
            <div className="row">

                <div className="col-md-4 pull-right">
                    <label>&nbsp;</label>
                    <div>
                    {self.state.editingPersonUid ? btnUpdate : btnAdd}
                    <input type="button" value="Clear" className="btn btn-default pull-right" onClick={self._onClickClear} />
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = PersonForm;