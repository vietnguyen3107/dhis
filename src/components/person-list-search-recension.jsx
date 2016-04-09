var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");
var Table = require("react-bootstrap").Table;

var PersonList = React.createClass({
    render: function() {
        var personList = this.props.persons.map(function(person, index) {
            return (
                <tr key={index}>
                    <td>{(person && person.appCode) ? person.appCode.value : ""}</td>
                    <td>{(person && person.firstName) ? person.firstName.value : ""}</td>
                    <td>{(person && person.birthday) ? person.birthday.value : ""}</td>
                    <td><input type="button" value="Add Recension" className="btn btn-success btn-xs" onClick={PersonActions.editPerson.bind(null, index)} />
                    </td>
              

                </tr>
            );
        }.bind(this));

        return (
            <div>
                <Table responsive>
					<thead>
						<tr>
							<th>appCode</th>
							<th>firstName</th>							
							<th>birthday</th>							
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {personList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = PersonList;