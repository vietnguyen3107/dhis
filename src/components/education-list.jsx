var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions");
var Table = require("react-bootstrap").Table;

var EducationList = React.createClass({
    render: function() {
        var educationList = null;
        if(this.props.educations != null)
        {
            educationList = this.props.educations.map(function(edu, index) {
                return (
                    <tr key={index}>
                        <td>{(edu && edu.orgUnitName) ? edu.orgUnitName.value : ""}</td>
                        <td>{(edu && edu.enrollmentStatus) ? edu.enrollmentStatus.value : ""}</td>
                        <td>
                            {(edu && edu.eventDate) ? edu.eventDate.value : ""}
                        </td>
                  
                        <td>
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
                        {educationList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = EducationList;