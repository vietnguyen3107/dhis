var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var ResultStore = require("../stores/result-store");
var ResultActions = require("../actions/result-actions");

    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var ResultForm = React.createClass({
    _onClickAdd: function() {        
        ResultActions.addResult(this.state.editingResult);
    },
    _onClickUpdate: function() {
        ResultActions.updateResult(this.state.editingResult);
    }, 
    _onClickClear: function() {
    },

    _onSelectChange: function(attr, val, e){
       
        if(this.state.editingResult == null ){
            this.state.editingResult = {};
        }
        if(this.state.editingResult[attr] == null){
            this.state.editingResult[attr] = {};
            this.state.editingResult[attr].value = val;
            this.state.editingResult[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingResult[attr].value = val;
        }


    },

    _onDatePickerChangeYYYYMMDD: function(attr, val, e){
        val = val.format("YYYY-MM-DD");
       
        if(this.state.editingResult == null ){
            this.state.editingResult = {};
        }
        if(this.state.editingResult[attr] == null){
            this.state.editingResult[attr] = {};
            this.state.editingResult[attr].value = val;
            this.state.editingResult[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingResult[attr].value = val;
        }



    },
    _onChange: function(attr, e) {

        if(this.state.editingResult == null ){
            this.state.editingResult = {};
        }
        if(this.state.editingResult[attr] == null){
            this.state.editingResult[attr] = {};
            this.state.editingResult[attr].value = e.target.value;
            this.state.editingResult[attr].uid = this.state.attrs[attr];

        }else{
            this.state.editingResult[attr].value = e.target.value;
        }
        this.setState({
            editingResult: this.state.editingResult,
        });
        
    },
    _onEdit: function() {
        
		
		var editingResult = ResultStore.getEditingResult();

		if (this.isMounted()) {
			if(editingResult && editingResult.event ){
				this.setState({
					editingResult: editingResult,
					editingResultUid: editingResult.event.value
				});
			}else{
				this.setState({
					editingResultUid: null,
					editingResult: null,
				});
			}
        }
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingResult: null,
            editingPersonUid : null,
            editingResultUid : null,
            forms: [],
            degrees: [],
        }
    },
    componentDidMount: function() {
        ResultStore.addEditListener(this._onEdit);
        ResultStore.addChangeListener(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/resultAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
        //result
        $.get("../../../../dhis/api/optionSets/W5W7CTTirnl?" + _config.optionFieldSearch, function (xml){
            
            var results = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                results.push(opt);
                
            });

            self.setState({results: results});
            
        });
        //licenseScopes
		/*
        $.get("../../../../dhis/api/optionSets/vnIZVLtjPgT?" + _config.optionFieldSearch, function (xml){
            
            var licenseScopes = [];
            var options = xml.options;        
            options.forEach(function(entry) {
                opt = {};
                opt.value = entry.code;
                opt.label = entry.name;

                licenseScopes.push(opt);
                
            });

            self.setState({licenseScopes: licenseScopes});
            
        });
		*/
        
        
    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="success" disabled={self.state.isLoading} onClick={self._onClickAdd}>{self.state.isLoading? 'Loading...' : 'Add'}</Button>  );
        var btnUpdate = (<Button bsStyle="success"  disabled={self.state.isLoading} onClick={self._onClickUpdate}>{self.state.isLoading? 'Loading...' : 'Update'}</Button>);
        
        return (
            <form className="form">
			 <div className="row">

		

                <div className="col-md-4 form-group-sm">
                <label>result*</label>
                <SimpleSelect
                        name="result"    
                        onChange={self._onSelectChange.bind(this, "result")}                    
                        options={self.state.results}
                        value=
                        {
                            (self.state.editingResult && self.state.editingResult.result) ? 
                                self.state.editingResult.result.value : 
                                ((self.state.editingResult && self.state.editingResult.result == null && self.state.editingResult[self.state.attrs["result"]]) ?
                                        self.state.editingResult[self.state.attrs["result"]].value  : "")
                        }
                ></SimpleSelect>

                   
                </div>



            </div>
            <div className="row">

                <div className="col-md-12">
                    <label>reason</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'reason')}

                        value=
                        {
                            (self.state.editingResult && self.state.editingResult.reason) ? 
                                self.state.editingResult.reason.value : 
                                ((self.state.editingResult && self.state.editingResult.reason == null && self.state.editingResult[self.state.attrs["reason"]]) ?
                                        self.state.editingResult[self.state.attrs["reason"]].value  : "")
                        }
                    />
                        
                </div>

            </div>
            <div className="row">

                <div className="col-md-12">
                    <label>requirementText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'requirementText')}

                        value=
                        {
                            (self.state.editingResult && self.state.editingResult.requirementText) ? 
                                self.state.editingResult.requirementText.value : 
                                ((self.state.editingResult && self.state.editingResult.requirementText == null && self.state.editingResult[self.state.attrs["requirementText"]]) ?
                                        self.state.editingResult[self.state.attrs["requirementText"]].value  : "")
                        }
                    />
                        
                </div>

            </div>
            <div className="row">

                <div className="col-md-12">
                    <label>requestRequirementText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'requestRequirementText')}

                        value=
                        {
                            (self.state.editingResult && self.state.editingResult.requestRequirementText) ? 
                                self.state.editingResult.requestRequirementText.value : 
                                ((self.state.editingResult && self.state.editingResult.requestRequirementText == null && self.state.editingResult[self.state.attrs["requestRequirementText"]]) ?
                                        self.state.editingResult[self.state.attrs["requestRequirementText"]].value  : "")
                        }
                    />
                        
                </div>

            </div>
			
            <div className="row">

                <div className="col-md-12">
                    <label>scopeText</label>
                    <Input type="text" bsSize="small"                        
                        onChange={self._onChange.bind(this, 'scopeText')}

                        value=
                        {
                            (self.state.editingResult && self.state.editingResult.scopeText) ? 
                                self.state.editingResult.scopeText.value : 
                                ((self.state.editingResult && self.state.editingResult.scopeText == null && self.state.editingResult[self.state.attrs["scopeText"]]) ?
                                        self.state.editingResult[self.state.attrs["scopeText"]].value  : "")
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
                    {self.state.editingResultUid ? btnUpdate : btnAdd}
                   
                </div>
            </div>

            </form>
        );
    }
});

module.exports = ResultForm;