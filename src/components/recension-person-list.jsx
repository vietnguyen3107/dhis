var React = require("react"),
    PersonStore = require("../stores/person-store"),
	PersonForm = require("./person-form"),
    PersonActions = require("../actions/person-actions");
var Table = require("react-bootstrap").Table;

var EducationPanel = require("./education-panel");
var ExperiencePanel = require("./experience-panel");
var DisciplinePanel = require("./discipline-panel");
var LicensePanel = require("./license-panel");
var ResultPanel = require("./result-panel");


var Tabs = require("react-bootstrap").Tabs;
var Tab = require("react-bootstrap").Tab;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;
var FontAwesome = require('react-fontawesome');
var Checkbox = require("react-bootstrap").Checkbox;
var SimpleSelect = require('react-select');

var Modal = require("react-bootstrap").Modal;

var Table2Excel = require("table-to-excel");

var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
function getItemFromArrayByValue(array, val){
		var result = "";
		array.forEach(function(entry) {
			
			if(entry.value == val){
				
				result = entry.label;
			}
		});
		return result;
		
	}	
	
var PersonListRecension = React.createClass({

	
	_onClickExportExcel(){
		var tableToExcel=new TableToExcel();
		 tableToExcel.render("dvData");
	},
	_onClickPrint(){
		
			var divToPrint=document.getElementById("dvData");
                    newWin= window.open("");
                    var html ="<style>table { margin: 1em; border-collapse: collapse;width:99% }"+
                        "td, th { padding: .3em; border: 1px #ccc solid; } "+
                        "@media print {thead { display: table-header-group; } .no-print , .no-print *{ display: none !important; border:none; } }"+
						".no-display{display:none}" +
                        "</style>"+
						" <table width='99%' class='no-print'><tr><td align='right'><button onclick='window.print();'> Print</button></td></tr></table><br/> " +
                        divToPrint.outerHTML ;
                    newWin.document.write(html);
	},
	_onClickEdit(index){
		
		this.setState({ showEditPersonForm: true, personIndex: index});
	},
	_onClickPrintHorizoneForm(){
		this.setState({ showHorizoneForm: true});
		
	},
	_onClickChangeStatusForm(){
		this.setState({ showChangeStatusForm: true});
	},
	_onSelectChange: function(attr, val, e){
		this.setState({ applicationStatus: val});
    },

	_onClickChangeStatus(){
		
		if(!confirm("Do you want to change Status of all Selected Application?"))
			return false;
		
		var self = this;
		var attr = "applicationStatus";
		var attrUid = "GvDIApK7R0j";
		
		var persons = [];
		self.state.checkedList.map(
			function(item, index) 
			{	var person = self.props.persons[index];
				if(item.checked){
					
					if(person[attr] == null){
						person[attr] = {};
						person[attr].value = self.state.applicationStatus;
						person[attr].uid = attrUid;

					}else{
						person[attr].value = self.state.applicationStatus;
					}
					
					persons.push(person);
				}
				
				
			}
		);
		PersonActions.updateListPerson(persons);
			
	},
	_onCloseModalHorizoneForm(){
		this.setState({ showHorizoneForm: false});
	},
	_onCloseModalChangeStatusForm(){
		this.setState({ showChangeStatusForm: false});
	},
	_onCheckboxChange: function(index){
	
		return function (e) {
			var list = this.state.checkedList;
			{
				var item = list[index];
				item.checked = !item.checked;
				
				if(!item.checked && this.state.checkAll)
					this.setState({checkAll: false});
					
				this.setState({checkedList: list});
				
			}
		}.bind(this) //important to bind function 
		
	},
	_onCheckboxAll: function(event){
		var list = this.state.checkedList;
		
		var checked = !this.state.checkAll;
		list.map(function(item, i) {
			item.checked = checked;
		});
		
		this.setState({checkedList: list, checkAll: checked});
		
	},
	_onEnterModal(){
		PersonActions.editPerson(this.state.personIndex);
	},
	_onCloseModal(){
		this.setState({ showEditPersonForm: false});
	},
	getInitialState: function() {		
        return {
            showEditPersonForm: false,
            showHorizoneForm: false,
            showChangeStatusForm: false,
			personIndex : -1,
			me: [],
			orgUnitUid: "",
			checkedList : [],
			checkAll: false
        }
    },
	componentWillReceiveProps: function(nextProps) {
		var self = this;
		var checkedList = [];
		if (nextProps.persons) {
			nextProps.persons.map(function(person, index) {
				checkedList.push({
					index: index,
					checked: false
				});
			});
			
			this.setState({ checkedList: checkedList, checkAll: false});
		}
	},
	componentWillMount: function(){
        var self = this;
        //me
        $.get("../../../../dhis/api/me.json?fields=*,organisationUnits[id,name,shortName,displayName]", function (json){
            self.setState({
				me: json,
				orgUnitUid: json.organisationUnits[0].id
			
			});
            
            
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
	},
    render: function() {

		var self = this;
        return (
	
            <div>
				
				<div>
				<Button bsStyle="info" bsSize="sm" bsSize="xsmall" onClick={self._onClickPrintHorizoneForm}><Glyphicon glyph="print" /> Horizone Form</Button>
				&nbsp;
				<Button bsStyle="info" bsSize="sm" bsSize="xsmall" onClick={self._onClickChangeStatusForm}><Glyphicon glyph="retweet" /> Change Status</Button>
				</div>
				<div className="clearfix "/>
                <Table responsive>
					<thead>
						<tr>		
							<th >
							<Button  bsSize="xsmall" onClick={self._onCheckboxAll} >
								{(self.state.checkAll) ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />}
							</Button>	
							</th>
							<th>appCode </th>
							<th>firstName</th>							
							<th>birthday</th>		
							<th>Subject</th>		
							<th>type</th>		
							<th>status</th>		
							<th>appdate</th>		
							<th>#</th>
							
						</tr>
					</thead>
                    <tbody>
                        {self.props.persons.map(function(person, index) {
							return (
								<tr key={index}>
									<td > 
									<Button  bsSize="xsmall" onClick={self._onCheckboxChange(index)} index={index}>
									{(self.state.checkedList[index].checked) ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />}
									</Button>
									</td>

									<td>{(person && person.appCode) ? person.appCode.value : ""}</td>
									<td>{(person && person.firstName) ? person.firstName.value : ""}</td>
									<td>{(person && person.birthday) ? person.birthday.value : ""}</td>
							
									<td>
										{(person.discipline == null) ? "" : getItemFromArrayByValue(self.state.disciplines, person.discipline.value)}
									</td>
									<td>
										{(person.applicationType == null) ? "" : getItemFromArrayByValue(self.state.applicationTypes, person.applicationType.value)}
									</td>
									<td>
										{(person.applicationStatus == null) ? "" : getItemFromArrayByValue(self.state.applicationStatuses, person.applicationStatus.value)}
									</td>
						
									
									<td>{(person && person.created) ? person.created.value : ""}</td>
									<td >
									<Button  bsSize="xsmall" onClick={self._onClickEdit.bind(null, index)}><Glyphicon glyph="edit" /></Button>
									</td>
							  
								</tr>
							)}
						)}
                    </tbody>
                </Table>
				<Modal  bsSize="large" show={this.state.showEditPersonForm} container={this} aria-labelledby="contained-modal-title" onHide={this._onCloseModal}  onEntered={this._onEnterModal} >
				  <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>
					<div>
						<Tabs defaultActiveKey={1}>
							<Tab eventKey={1} title="GENERAL" tabClassName="div">

								<div className="panel-body">
										<div>
											<PersonForm orgUnitUid={this.state.orgUnitUid}/>

										</div>
								</div>
					    	</Tab>
						    <Tab eventKey={2} title="EDUCATION">
						    	<div className="panel-body">
										<div>											
						    				<EducationPanel />
										</div>
								</div>
						    </Tab>
						    <Tab eventKey={3} title="EXPERIENCE">
						    	<div className="panel-body">
										<div>											
						    				<ExperiencePanel />
										</div>
								</div>
						    </Tab>
						    <Tab eventKey={4} title="DISCIPLINE">
						    	<div className="panel-body">
										<div>											
						    				<DisciplinePanel />
										</div>
								</div>
						    </Tab>
						    <Tab eventKey={5} title="LICENSE">
						    	<div className="panel-body">
										<div>											
						    				<LicensePanel />
										</div>
								</div>
						    </Tab>
						    <Tab eventKey={6} title="RESULT">
						    	<div className="panel-body">
										<div>											
						    				<ResultPanel />
										</div>
								</div>
						    </Tab>
						    
						</Tabs>
					</div>
				  </Modal.Body>
				  <Modal.Footer>
					<Button onClick={this._onCloseModal}>Close</Button>
				  </Modal.Footer>
				</Modal>
				
				<Modal  
					bsSize="large" 
					show={this.state.showHorizoneForm} 
					container={this} 
					aria-labelledby="contained-modal-title" 
					onHide={this._onCloseModalHorizoneForm}
					dialogClassName="custom-modal"
				>
				  <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title">Horizone Form</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>
					<div>
						<div >
						<Button bsStyle="info" bsSize="sm" bsSize="xsmall" onClick={self._onClickExportExcel}><Glyphicon glyph="export" /> Export Excel</Button>
						&nbsp;
						&nbsp;
						<Button bsStyle="info" bsSize="sm" bsSize="xsmall" onClick={self._onClickPrint}><Glyphicon glyph="print" /> Print</Button>
						</div>

						<div className="clearfix "/>
						<Table id='dvData' responsive>
							<thead>
								<tr>		
									<th>appCode </th>
							<th>firstName</th>							
							<th>birthday</th>		
							<th>Subject</th>		
							<th>type</th>		
							<th>status</th>		
							<th>appdate</th>		
							<th>peopleIndentity</th>		
							<th>idIssuedDate</th>		
							<th>idIssuedPlaceText</th>		
							<th>mobilePhone</th>		
							<th>address</th>		
							<th>result</th>		
							<th>reason</th>		
								</tr>
							</thead>
							<tbody>
								{self.state.checkedList.map(
									function(item, index) 
									{
										if(item.checked){
											var person = self.props.persons[index];
											return (
												<tr key={index}>
													<td>{(person && person.appCode) ? person.appCode.value : ""}</td>
													<td>{(person && person.firstName) ? person.firstName.value : ""}</td>
													<td>{(person && person.birthday) ? person.birthday.value : ""}</td>
											
													<td>
														{(person.discipline == null) ? "" : getItemFromArrayByValue(self.state.disciplines, person.discipline.value)}
													</td>
													<td>
														{(person.applicationType == null) ? "" : getItemFromArrayByValue(self.state.applicationTypes, person.applicationType.value)}
													</td>
													
													<td>
														{(person.applicationStatus == null) ? "" : getItemFromArrayByValue(self.state.applicationStatuses, person.applicationStatus.value)}
													</td>
													
													<td>{(person && person.created) ? person.created.value : ""}</td>
													<td>{(person && person.peopleIndentity) ? person.peopleIndentity.value : ""}</td>
													<td>{(person && person.idIssuedDate) ? person.idIssuedDate.value : ""}</td>
													<td>{(person && person.idIssuedPlaceText) ? person.idIssuedPlaceText.value : ""}</td>
													<td>{(person && person.mobilePhone) ? person.mobilePhone.value : ""}</td>
													<td>{(person && person.tempAddress) ? person.tempAddress.value : ""}</td>
													<td></td>
													<td></td>
												</tr>
											)
										}else{
											return null;
										}
									}
									
								)}
							</tbody>
						</Table>
						
					</div>
				  </Modal.Body>
				  <Modal.Footer>
					<Button onClick={this._onCloseModalHorizoneForm}>Close</Button>
				  </Modal.Footer>
				</Modal>
				
				
				<Modal  
					bsSize="sm" 
					show={this.state.showChangeStatusForm} 
					container={this} 
					aria-labelledby="contained-modal-title" 
					onHide={this._onCloseModalChangeStatusForm}
				>
				  <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title">Change Status Of Selected Applications</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>
					<div>
			
						 <div className="row">		
							<div className="col-md-12 form-group-sm">
								<label>applicationStatus</label>
								<SimpleSelect
									name="applicationStatus"                    
									options={self.state.applicationStatuses}
									onChange={self._onSelectChange.bind(this, "applicationStatus")}
									value={self.state.applicationStatus}
								   
							
								/>
							</div>
						</div>
					</div>
				  </Modal.Body>
				  <Modal.Footer>
				  
					<Button bsStyle="info" bsSize="sm"  onClick={self._onClickChangeStatus}><Glyphicon glyph="retweet" /> Change</Button>
					&nbsp;
					<Button onClick={this._onCloseModalChangeStatusForm}>Close</Button>
				  </Modal.Footer>
				</Modal>
            </div>

        );
    }
});

module.exports = PersonListRecension;