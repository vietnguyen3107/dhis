var React = require("react"),
    ExperienceActions = require("../actions/experience-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

var ExperienceList = React.createClass({
    render: function() {
        var experienceList = null;
        if(this.props.experiences != null)
        {
            experienceList = this.props.experiences.map(function(edu, index) {
                return (
                    <tr key={index}>
                        <td>{(edu && edu.orgUnitName) ? edu.orgUnitName.value : ""}</td>
                        <td>{(edu && edu.enrollmentStatus) ? edu.enrollmentStatus.value : ""}</td>
                        <td>
                            {(edu && edu.eventDate) ? edu.eventDate.value : ""}
                        </td>
                  
                        <td>
                            <Button bsStyle="success" bsSize="xsmall" onClick={ExperienceActions.editExperience.bind(null, index)}>Edit</Button>
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
                        {experienceList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = ExperienceList;