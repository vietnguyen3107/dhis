var React = require("react"),
    PersonActions = require("../actions/person-actions"),
    PersonStore = require("../stores/person-store"),
    PersonForm = require("./person-form"),
    PersonFormSearch = require("./person-form-search"),
    PersonList = require("./person-list");

var EducationPanel = require("./education-panel");

var Tabs = require("react-bootstrap").Tabs;
var Tab = require("react-bootstrap").Tab;

var Main = React.createClass({
    _onChange: function() {
        this.setState({
            persons: PersonStore.getPersons(),
        })
    },
    getInitialState: function() {
    	PersonActions.searchPerson({firstName: '1900'});
        return {
            persons: PersonStore.getPersons(),
        }
    },
    componentDidMount: function() {
        PersonStore.addChangeListener(this._onChange);
    },
    render: function() {
        return (

		<div className='container' >
			<nav className="navbar navbar-default">
				<div className="container-fluid">
				    <div className="navbar-header">
				      <a className="navbar-brand" href="#">LICENSING</a>
				    </div>
				    <div>
				      <ul className="nav navbar-nav">
				        <li className="active"><a href="#">HOME</a></li>
				        <li><a href="#">CHỨC NĂNG</a></li>
				        <li><a href="#">HỆ THỐNG</a></li>
				        <li><a href="#">TRỢ GIÚP</a></li>
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
								<PersonFormSearch/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
								<PersonList persons={this.state.persons} />
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
											<PersonForm/>

										</div>
								</div>
					    	</Tab>
						    <Tab eventKey={2} title="EDUCATION">
						    	<div className="panel-body">
										<div>											
						    				<EducationPanel educations={this.state.persons}/>
										</div>
								</div>
						    </Tab>
						    <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
						</Tabs>
					
				</div>
			</div>
			<div className='row'>
				<div className="panel panel-default">
					<div className="panel-body">  <img src='img/logo.jpg'/></div>
				</div>
			</div>
		</div>

        );
    }
});

module.exports = Main;