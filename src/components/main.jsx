var React = require("react"),
    PersonActions = require("../actions/person-actions"),
    PersonStore = require("../stores/person-store"),
    PersonForm = require("./person-form"),
    PersonFormSearch = require("./person-form-search"),
    PersonList = require("./person-list");

var Main = React.createClass({
    _onChange: function() {
        this.setState({
            persons: PersonStore.getPersons(),
        })
    },
    getInitialState: function() {
    	PersonActions.searchPerson({fullName: 'Viet'});
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
				<div className='col-sm-4'>
				    <div className="panel panel-default">
						<div className="panel-heading">LIST</div>
						<div className="panel-body">
								
							<PersonFormSearch/>
							<PersonList persons={this.state.persons} />

				  
							
						</div>
					</div>
				</div>
				<div className='col-sm-8'>
				  <ul className="nav nav-tabs">
				    <li className="active"><a href="#home">GENERAL</a></li>
				    <li><a href="#menu1">EDUCATION</a></li>
				    <li><a href="#menu2">EXPERIENCE</a></li>
				    <li><a href="#menu3">RESULT</a></li>
					<li><a href="#menu4">LICENSE</a></li>
				  </ul>

				  <div className="tab-content">
				    <div id="home" className="tab-pane fade in active">
						<div className="panel panel-default">
							<div className="panel-body">
								<div>
									<PersonForm/>

								</div>
							</div>
						</div>
				     
				    </div>
				    <div id="menu1" className="tab-pane fade">
				      <div className="panel panel-default">
							<div className="panel-body">
								<div >sfsdfsdf</div>
							</div>
						</div>
				    </div>
				    <div id="menu2" className="tab-pane fade">
				      <div className="panel panel-default">
							<div className="panel-body">
								<div></div>
								
							</div>
						</div>
				    </div>
				    <div id="menu3" className="tab-pane fade">
				      <div className="panel panel-default">
							<div className="panel-body">
								<div></div>
								
							</div>	
							</div>
						</div>
				    <div id="menu4" className="tab-pane fade">
				      <div className="panel panel-default">
							<div className="panel-body">
								<div></div>
					
							</div>
						</div>
				    </div>
				  </div>
				</div>
				</div>

				<div className="panel panel-default">
				  <div className="panel-body">  <img src='img/logo.jpg'/></div>
				</div>
			</div>

        );
    }
});

module.exports = Main;