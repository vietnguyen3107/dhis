var React = require("react"),
	Global = require('react-global');
var I18n = require("i18n-js");

var RecensionPanel = require("./recension-panel");
var RecensionStore = require("../stores/recension-store");
var RecensionAction = require("../actions/recension-actions");


var RecensionMain = React.createClass({
    _onChange: function() {
        this.setState({
            recensions: RecensionStore.getRecensions(),
        })
    },
	_onChildChanged: function(newState) {
		console.log("ne state");
		console.log(newState);
        this.setState({ orgUnitUid: newState.orgUnitUid });
    },
    getInitialState: function() {
    	
        return {
            recensions: RecensionStore.getRecensions(),
			me: [],
			orgUnitUid: ""
        }
    },
    componentDidMount: function() {
        RecensionStore.addChangeListener(this._onChange);
	
    },
	componentWillMount: function(){
        var self = this;

       
        //me
        $.get("../../../../dhis/api/me.json?fields=*,organisationUnits[id,name,shortName,displayName]", function (json){
            self.setState({me: json});
            
        });
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
				        <li><a href="index.html">RECEPTION</a></li>
				        <li><a href="handling.html">HANDLING</a></li>
				         <li className="active"><a href="#">RECENSION</a></li>
				        <li><a href="#">HELP</a></li>
				      </ul>
				    </div>
				</div>
			</nav>

			<div className='row'>

				<div className='col-md-12'>								
					<RecensionPanel />
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


module.exports = RecensionMain;