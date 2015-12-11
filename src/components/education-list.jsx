var React = require("react"),
    EducationActions = require("../actions/education-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

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
                            <Button bsStyle="success" bsSize="xsmall" onClick={EducationActions.editEducation.bind(null, index)}>Edit</Button>
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