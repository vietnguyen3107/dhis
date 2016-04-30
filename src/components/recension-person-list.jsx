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

var Modal = require("react-bootstrap").Modal;

var PersonListRecension = React.createClass({

	_onClickEdit(index){
		
		this.setState({ show: true, personIndex: index});
	},
	_onEnterModal(){
		PersonActions.editPerson(this.state.personIndex);
	},
	_onCloseModal(){
		this.setState({ show: false});
	},
	getInitialState: function() {
        return {
            show: false,
			personIndex : -1,
			me: [],
			orgUnitUid: ""
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
	},
    render: function() {

		var self = this;
        return (
            <div>
                <Table responsive>
					<thead>
						<tr>
							<th>appCode 123</th>
							<th>firstName</th>							
							<th>birthday</th>							
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {self.props.persons.map(function(person, index) {
							return (
								<tr key={index}>
									<td>{(person && person.appCode) ? person.appCode.value : ""}</td>
									<td>{(person && person.firstName) ? person.firstName.value : ""}</td>
									<td>{(person && person.birthday) ? person.birthday.value : ""}</td>
									<td>
									<Button bsStyle="success" bsSize="xsmall" onClick={self._onClickEdit.bind(null, index)}>Edit</Button>
									</td>
							  
									<td>
										<input type="button" value="Remove" className="btn btn-danger btn-xs hidden" onClick={PersonActions.removePerson.bind(null, index)} />
									</td>

								</tr>
							)}
						)}
                    </tbody>
                </Table>
				<Modal  bsSize="large" show={this.state.show} container={this} aria-labelledby="contained-modal-title" onHide={this._onCloseModal}  onEntered={this._onEnterModal} >
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
            </div>

        );
    }
});

module.exports = PersonListRecension;