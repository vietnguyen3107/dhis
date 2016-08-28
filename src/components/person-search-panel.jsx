var React = require("react"),
    PersonActions = require("../actions/person-actions"),
    PersonStore = require("../stores/person-store"),
    PersonFormSearch = require("./person-form-search"),
    PersonList = require("./person-list-search-recension"),
	Global = require('react-global');
var I18n = require("i18n-js");


var PersonSearchPanel = React.createClass({
    _onChange: function() {
		console.log("searchpanel");
		console.log(PersonStore.getPager());
		if (this.isMounted()) {
			this.setState({
				persons: PersonStore.getPersons(),
            	pager: PersonStore.getPager()
			})
        }
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
	
	componentWillReceiveProps : function(props){
		this.setState({recension: props.recension});
	},
    componentDidMount: function() {
        PersonStore.addChangeListener(this._onChange);
    },
	componentWillMount: function(){
        var self = this;

       
        //me
        $.get("../../../../dhis/api/me.json?fields=*,organisationUnits[id,name,shortName,displayName]", function (json){
            self.setState({me: json});
            
        });
		//PersonActions.searchPerson({firstName: 'test'});
	},
    render: function() {
        return (
		


			<div className='row'>
				<div className='col-md-4'>
				    <div className="panel panel-default">
						<div className="panel-heading">SEARCH</div>
						<div className="panel-body">
							<div className="row">
								<div className="col-md-12">
								<PersonFormSearch me={this.state.me} pager={this.state.pager} callbackParent={this._onChildChanged}/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
								
								</div>
							</div>
				  
						</div>
						
					</div>
				</div>
				<div className='col-md-8'>
						<PersonList persons={this.state.persons} recension={this.props.recension}  />
					
				</div>
			</div>
			

        );
    }
});


module.exports = PersonSearchPanel;