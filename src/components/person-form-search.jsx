var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PersonFormSearch = React.createClass({
    _onClickSearch: function() {
		this.setState({
			isLoading: true
		});
        PersonActions.searchPerson({firstName: this.state.nameSearch});
    },
    
    getInitialState: function() {
        return {
            nameSearch: "1900",
			isLoading: true
        }
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
			PersonActions.searchPerson({firstName: this.state.nameSearch});
		}
    },
	_onChange: function(e) {
		this.setState({
            isLoading: false
        });
    },
    componentDidMount: function() {
        PersonStore.addChangeListener(this._onChange);
    },
    render: function() {
        var btnSearch = (<Button bsStyle="default" onClick={this._onClickSearch} >{this.state.isLoading ? 'loading' : 'Search'}</Button>);

        return (
                <div>
                <div className="row">
                    <div className="col-md-12">
                        <label>Họ tên:</label>
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