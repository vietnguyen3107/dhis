var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PersonFormSearch = React.createClass({
    _onClickSearch: function() {
        PersonActions.searchPerson({firstName: this.state.nameSearch});
    },
    
    getInitialState: function() {
        return {
            nameSearch: "1900"
        }
    },
    _onChangeName: function(e) {
        this.setState({
            nameSearch: e.target.value,
        });
    },
    componentDidMount: function() {
        //PersonStore.addChangeListener(this._onClickSearch);
    },
    render: function() {
        var btnSearch = (<Button bsStyle="default" onClick={this._onClickSearch} >Search</Button>);

        return (
            <form className="form">
                
                <div className="row">
                    <div className="col-md-12">
                        <label>Họ tên:</label>
                        <Input type="text"  bsSize="small"  value={this.state.nameSearch} onChange={this._onChangeName}   />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div  className="pull-right">
                            {btnSearch}
                        </div>
                    </div>
                </div>
                
                
            </form>
        );
    }
});

module.exports = PersonFormSearch;