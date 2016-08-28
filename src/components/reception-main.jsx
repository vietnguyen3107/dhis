var React = require("react"),
    PersonActions = require("../actions/person-actions"),
    PersonStore = require("../stores/person-store"),
    PersonForm = require("./person-form"),
    PersonFormSearch = require("./person-form-search"),
    PersonList = require("./person-list"),
	Global = require('react-global');
var I18n = require("i18n-js");

var EducationPanel = require("./education-panel");
var ExperiencePanel = require("./experience-panel");
var DisciplinePanel = require("./discipline-panel");
var DocumentPanel = require("./document-panel");



var Tabs = require("react-bootstrap").Tabs;
var Tab = require("react-bootstrap").Tab;

var ReceptionMain = React.createClass({
    _onPersonListChange: function() {
        this.setState({
            persons: PersonStore.getPersons(),
            pager: PersonStore.getPager()
        })
    },
	_onChildChanged: function(newState) {

        this.setState({ orgUnitUid: newState.orgUnitUid });
    },
    getInitialState: function() {

        return {
            persons: PersonStore.getPersons(),
            pager: PersonStore.getPager(),
			me: [],
			orgUnitUid: ""
        }
    },
    componentDidMount: function() {
        PersonStore.addChangeListener(this._onPersonListChange);
    },
	componentWillMount: function(){
        var self = this;


        //me
        $.get("../../../../dhis/api/me.json?fields=*,organisationUnits[id,name,shortName,displayName]", function (json){
            self.setState({me: json, orgUnitUid: json.organisationUnits[0].id});

        });
		//PersonActions.searchPerson({firstName: 'test'});
	},
    render: function() {
        return (

		<div className='container' >

			<nav className="navbar navbar-default">
				<div className="container-fluid">
				    <div className="navbar-header">
				    	<img className="pull-left"  src='https://irp-cdn.multiscreensite.com/9a4c81ba/dms3rep/multi/desktop/icon_license_orange-600x600.png' height='48px'/>
				      <a className="navbar-brand" href="#">&nbsp;LICENSING MANAGER SYSTEM</a>
				    </div>
				    <div>
				      <ul className="nav navbar-nav">
				        <li className="active"><a href="#">RECEPTION</a></li>
				        <li><a href="handling.html">HANDLING</a></li>
				         <li><a href="recension.html">RECENSION</a></li>
				        <li><a href="#">HELP</a></li>
				      </ul>
				    </div>
				</div>
			</nav>

			<div className='row'>
				<div className='col-md-4'>
				    <div className="panel panel-default">
						<div className="panel-heading">LIST</div>
						<div className="panel-body">
							<div className="row">
								<div className="col-md-12">
								<PersonFormSearch me={this.state.me} pager={this.state.pager} callbackParent={this._onChildChanged}/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
								<PersonList persons={this.state.persons}  />
								</div>
							</div>

						</div>

					</div>
				</div>
				<div className='col-md-8'>
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
                <Tab eventKey={4} title="DOCUMENT">
						    	<div className="panel-body">
										<div>
						    				<DocumentPanel />
										</div>
								</div>
						    </Tab>

						    <Tab eventKey={5} title="DISCIPLINE">
						    	<div className="panel-body">
										<div>
						    				<DisciplinePanel />
										</div>
								</div>
						    </Tab>

						</Tabs>

				</div>
			</div>
			<div className='row'>
				<div className="panel panel-default">
					<div className="panel-body">  <img src='images/dhis2.jpg'/></div>
				</div>
			</div>
		</div>

        );
    }
});


module.exports = ReceptionMain;
