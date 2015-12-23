var React = require("react"),
    DisciplineActions = require("../actions/discipline-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

var DisciplineList = React.createClass({
    render: function() {
        var disciplineList = null;
        if(this.props.disciplines != null)
        {
            disciplineList = this.props.disciplines.map(function(edu, index) {
                return (
                    <tr key={index}>
                        <td>{(edu && edu.orgUnitName) ? edu.orgUnitName.value : ""}</td>
                        <td>{(edu && edu.enrollmentStatus) ? edu.enrollmentStatus.value : ""}</td>
                        <td>
                            {(edu && edu.eventDate) ? edu.eventDate.value : ""}
                        </td>
                  
                        <td>
                            <Button bsStyle="success" bsSize="xsmall" onClick={DisciplineActions.editDiscipline.bind(null, index)}>Edit</Button>
                        </td>

                    </tr>
                );
            }.bind(this));
        }
        return (
            <div>
                <div>List</div>
                <Table responsive>
                    <tbody>
                        {disciplineList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = DisciplineList;