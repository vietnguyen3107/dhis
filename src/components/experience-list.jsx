var React = require("react"),
    ExperienceActions = require("../actions/experience-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

var ExperienceList = React.createClass({
	componentWillMount: function(){
        var self = this;

        $.get("./data/experienceAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
	},
	getInitialState: function() {
        return {
         
            attrs: [],
        }
    },
    render: function() {
        var experienceList = null;
        if(this.props.experiences != null)
        {
            experienceList = this.props.experiences.map(function(entry, index) {
                return (
                    <tr key={index}>
                        <td>{(entry.startString != null) ? entry.startString.value :(entry[this.state.attrs["startString"]] != null ? entry[this.state.attrs["startString"]].value : "")}</td>
                        <td>{(entry.endString != null) ? entry.endString.value :(entry[this.state.attrs["endString"]] != null ? entry[this.state.attrs["endString"]].value : "")}</td>
                        <td>
                            {(entry.hospitalExperienceText != null) ? entry.hospitalExperienceText.value :(entry[this.state.attrs["hospitalExperienceText"]] != null ? entry[this.state.attrs["hospitalExperienceText"]].value : "")}
                        </td>
						<td>
                            {(entry.experiencePositionText != null) ? entry.experiencePositionText.value :(entry[this.state.attrs["experiencePositionText"]] != null ? entry[this.state.attrs["experiencePositionText"]].value : "")}
                        </td>
                  
                        <td>
                            <Button bsStyle="primary" bsSize="sm" bsSize="xsmall" onClick={ExperienceActions.editExperience.bind(null, index)}>Edit</Button>
                        </td>

                    </tr>
                );
            }.bind(this));
        }
        return (
            <div>
                <Table responsive>
					<thead>
						<tr>
							<th>fromDate</th>
							<th>toDate</th>
							<th>hospital</th>
							<th>position</th>
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {experienceList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = ExperienceList;