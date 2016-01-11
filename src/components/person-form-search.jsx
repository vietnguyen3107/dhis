var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions"),
	Global = require('react-global');

var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var SimpleSelect = require('react-select');

var PersonFormSearch = React.createClass({
    _onClickSearch: function() {
		this.setState({
			isLoading: true
		});
        PersonActions.searchPerson({firstName: this.state.nameSearch, orgUnitUid: this.state.orgUnitUid});
    },

    _onChangeName: function(e) {
        this.setState({
            nameSearch: e.target.value,
        });
    },
    _onKeyDown: function(e) {
		if('13' == e.keyCode){
			this.setState({
				isLoading: true
			});
			PersonActions.searchPerson({firstName: this.state.nameSearch, orgUnitUid: this.state.orgUnitUid});
		}
    },
	_onChange: function(e) {
		//alert(this.props.me.organisationUnits[0].id);
		this.setState({
            isLoading: false
        });
    },
	_onOrgUnitChange: function(val, e){
		//alert(this.props.me.organisationUnits[0].id);
		this.setState({
            orgUnitUid: val,
        });
		this.props.callbackParent({'orgUnitUid':val});
    },
	    
    getInitialState: function() {
        return {
            nameSearch: "1900",
			isLoading: false,
			orgUnits: [],
			orgUnitUid : "",
			me: null
        }
    },

    componentDidMount: function() {
		
        PersonStore.addChangeListener(this._onChange);
		
    },
	componentWillMount: function(){
        if(this.state.orgUnits.length > 0){
			this.setState({orgUnitUid: orgUnits[0].value});
			
		}
	},
	componentWillReceiveProps : function(props){
		var self = this;
		
		if(self.state.me == null || self.state.me.id != props.me.id){
			console.log("willreceive");
			//orgUnits
			$.get("../../../../dhis/api/organisationUnits/" + props.me.organisationUnits[0].id, function (xml){
				
				var orgUnits = [];
				{			
					opt = {};
					opt.value = props.me.organisationUnits[0].id;
					opt.label = props.me.organisationUnits[0].name;

					orgUnits.push(opt);
				}
				var options = xml.children;        
				options.forEach(function(entry) {
					opt = {};
					opt.value = entry.id;
					opt.label = entry.name;

					orgUnits.push(opt);
					
				});

				self.setState({orgUnits: orgUnits, me: props.me});
				
				self.setState({orgUnitUid: orgUnits[0].value});
		
				
			});
		}
	},
    render: function() {
        var btnSearch = (<Button bsStyle="default" onClick={this._onClickSearch} disabled={this.state.isLoading}>{this.state.isLoading ? 'loading' : 'Search'}</Button>);
		//alert(this.props.me);
        return (
                <div>
                <div className="row">
                    <div className="col-md-12">
                        <label>OrgUnit</label>
                        <SimpleSelect
								name="orgUnit"    								     
								options={this.state.orgUnits}
								onChange={this._onOrgUnitChange}      
								value={this.state.orgUnitUid}
								
						></SimpleSelect>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label>Name</label>
                        <Input type="text"  bsSize="small"  value={this.state.nameSearch} onChange={this._onChangeName} onKeyDown={this._onKeyDown}  />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div  className="pull-right">
                            {btnSearch}
                        </div>
                    </div>
                </div>
                </div>
				
 
        );
    }
});

module.exports = PersonFormSearch;