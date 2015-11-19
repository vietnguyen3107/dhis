var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");

var PersonList = React.createClass({
    render: function() {
        var personList = this.props.persons.map(function(person, index) {
            return (
                <tr key={index}>
                    <td>{(person && person.fullName) ? person.fullName.value : ""}</td>
                    <td>{(person && person.appCode) ? person.appCode.value : ""}</td>
                    <td><input type="button" value="Edit" className="btn btn-success btn-xs" onClick={PersonActions.editPerson.bind(null, index)} />
                    </td>
              
                    <td>
                        <input type="button" value="Remove" className="btn btn-danger btn-xs hidden" onClick={PersonActions.removePerson.bind(null, index)} />
                    </td>

                </tr>
            );
        }.bind(this));

        return (
            <div>
                <table className="table">
                    <tbody>
                        {personList}
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = PersonList;