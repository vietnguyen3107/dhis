var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var DisciplineStore = require("../stores/discipline-store");

var SimpleSelect = require("react-selectize").SimpleSelect;
var DatePicker = require("react-datepicker");
var moment = require("moment");



    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var PersonForm = React.createClass({
    _onClickAdd: function() {
        PersonActions.addPerson({fullName: this.state.fullName});

        this.setState({
            fullName: "",
        });
    },
    _onClickUpdate: function() {
        var editingPerson = this.state.editingPerson;
        PersonActions.updatePerson({fullName: this.state.fullName, appCode: this.state.appCode});

        this.setState({
            fullName: "",
        });
    },
    _onChangeName: function(e) {
        this.setState({
            fullName: e.target.value,
        });
    },
    _onEdit: function() {
        var editingPerson = PersonStore.getEditingPerson();

        this.setState({
            editingPerson: editingPerson,
        });
    },
    getInitialState: function() {
        return {

            editingPerson: null,
            addingPerson : null,
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
        this.req = $.getJSON("http://restverse.com/countries").done(function(countries){
            self.setState({countries: countries}, function(){
                self.refs.countrySelect.highlightFirstSelectableOption();
            });
        }).always(function(){
            delete self.req;
        });
        //applicationType
        $.get("../dhis/api/optionSets/FQS1S2NwFyC?" + _config.optionFieldSearch, function (xml){
            
            var applicationTypes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                applicationType = {};
                applicationType.value = entry.code;
                applicationType.label = entry.name;

                applicationTypes.push(applicationType);
                
            });

            self.setState({applicationTypes: applicationTypes}, function(){
                self.refs.applicationTypeSelect.highlightFirstSelectableOption();
            });
            
        });
        //disciplines
        $.get("../dhis/api/optionSets/vLyLsFHBomG?" + _config.optionFieldSearch, function (xml){
            
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


        self.setState(
            {
                // applicationTypes: 
                // [
                //     {value: '1179', label: 'Cấp mới'}, 
                //     {value: '1180', label: 'Cấp lại (bị mất)'}, 
                //     {value: '19866', label: 'Cấp lại (thu hồi)'},
                //     {value: '19866', label: 'Bổ sung phạm vi CM'},
                //     {value: '19866', label: 'Bổ sung hồ sơ lần 1'},
                //     {value: '19866', label: 'Bổ sung hồ sơ lần 2'},
                // ],
                genders: 
                [
                    {value: '19933', label: 'Male'}, 
                    {value: '19934', label: 'Female'},
                ],
                                

            }
        );
    },
    render: function() {
        var btnAdd = (<input type="button" value="Add" className="btn btn-default pull-right" onClick={this._onClickAdd} />);
        var btnUpdate = (<input type="button" value="Update" className="btn btn-default pull-right" onClick={this._onClickUpdate} />);
        var self = this;
        return (
            <form className="form">
            <div className="row">

                <div className="col-md-4">
                    <label>hospitalCode</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.hospitalCode}  />

                </div>

                <div className="col-md-4">
                <label>appCode</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.appCode }  />
                </div>

                <div className="col-md-4">
                <label>Ngày nộp*</label>                
                    <DatePicker className="form-control"
                        selected={this.state.startDate}
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
                        ref = "disciplineSelect"
                        placeholder = "discipline"
                        options = {this.state.disciplines}
                  
                        // onValueChange :: Item -> (a -> Void) -> void
                        onValueChange = {function(discipline, callback){
                            self.setState({discipline: discipline.value}, callback);
                        }}

                        // renderNoResultsFound :: a -> ReactElement
                        renderNoResultsFound = {function() {
                            return <div className = "no-results-found">
                                {!!self.req ? "loading ..." : "No results found"}
                            </div>
                        }}
                    />
          
 
                </div>

                <div className="col-md-4">
                    <label>Loại hồ sơ*</label>
                    <SimpleSelect
                        ref = "applicationTypeSelect"
                        placeholder = "applicationType"
                        options = {this.state.applicationTypes}
                  
                        // onValueChange :: Item -> (a -> Void) -> void
                        onValueChange = {function(appType, callback){
                            self.setState({applicationType: appType.value}, callback);
                        }}

                        // renderNoResultsFound :: a -> ReactElement
                        renderNoResultsFound = {function() {
                            return <div className = "no-results-found">
                                {!!self.req ? "loading ..." : "No results found"}
                            </div>
                        }}
                    />
                </div>

            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>Người nhận</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.recipientName}/>
                
                </div>
                <div className="col-md-4">
                    <label>Chức Vụ</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.recipientPosition}/>
                </div>
                <div className="col-md-4">
                    <label>Nơi nộp</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.lblIssuedPlace}/>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>Người xử lý</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.processedBy}/>
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
                    <label>Họ và tên*</label>
                    <input className="form-control" 
                        value={this.state.editingPerson == null ? "" : this.state.editingPerson.fullName} 
                        onChange={this._onChangeName} />
                </div>
                <div className="col-md-4">
                    <label>Giới tính</label>
                    <SimpleSelect
                        placeholder = "gender"
                        options = {this.state.genders}
                      
                    />
                </div>
                <div className="col-md-4">
                    <label>Ngày sinh*</label>
                    <DatePicker className="form-control"
                    dateFormat= "DD/MM/YYYY"
                        selected={this.state.editingPerson ? moment(this.state.editingPerson.birthday, "DD/MM/YYYY") : null}
                        
                    />
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <label>Nơi sinh</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.birthPlaceText}/>
                
                </div>
                <div className="col-md-4">
                    <label>Quốc tịch</label>
                    <SimpleSelect
                        ref = "countrySelect"
                        placeholder = "Select a country"
                        options = {this.state.countries}
                        value = {this.state.editingPerson == null ? "" : this.state.editingPerson.nationlity}

                        // onValueChange :: Item -> (a -> Void) -> void
                        onValueChange = {function(country, callback){
                            self.setState({country: country}, callback);
                        }}

                        // renderNoResultsFound :: a -> ReactElement
                        renderNoResultsFound = {function() {
                            return <div className = "no-results-found">
                                {!!self.req ? "loading countries ..." : "No results found"}
                            </div>
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <label>Dân tộc</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.ethnicText}/>
                
                </div>

            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>peopleIdentity</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.peopleIdentity}/>
                
                </div>
                <div className="col-md-4">
                    <label>idIssuedDate</label>
                    <DatePicker className="form-control"
                        dateFormat= "DD/MM/YYYY"
                        selected={this.state.editingPerson ? moment(this.state.editingPerson.idIssuedDate, "DD/MM/YYYY") : null}
                    ></DatePicker>

                
                </div>
                <div className="col-md-4">
                    <label>idIssuedPlaceText</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.idIssuedPlaceText}/>
                
                </div>
            </div>
            <div className="row">

                <div className="col-md-4">
                    <label>tempAddress</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.tempAddress}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempProvince</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.tempProvince}/>
                
                </div>
                <div className="col-md-4">
                    <label>tempDistrict</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.tempDistrict}/>
                
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <label>tempWard</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.tempWard}/>
                
                </div>

                <div className="col-md-4">
                    <label>email</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.email}/>
                </div>
                <div className="col-md-4">
                    <label>mobilePhone</label>
                    <input className="form-control" value={this.state.editingPerson == null ? "" : this.state.editingPerson.mobilePhone}/>
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
                    {this.state.editingPerson ? btnUpdate : btnAdd}

                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = PersonForm;