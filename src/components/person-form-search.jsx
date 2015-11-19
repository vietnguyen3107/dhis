var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var PersonFormSearch = React.createClass({
    _onClickSearch: function() {
        PersonActions.searchPerson({fullName: this.state.nameSearch});
    },
    
    getInitialState: function() {
        return {
            nameSearch: "Viet"
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
        var btnSearch = (<input type="button" value="Search" className="btn btn-default" onClick={this._onClickSearch} />);

        return (
            <form className="form">

                <div className="form-group">
                  <label>Họ tên:</label>
                  <input className="form-control" value={this.state.nameSearch} onChange={this._onChangeName}   />
                </div>
                <div className="form-group">
                  <label>Mã số:</label>
                  
                </div>

                {btnSearch}
                
            </form>
        );
    }
});

module.exports = PersonFormSearch;