var React = require("react"),
    EducationActions = require("../actions/education-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

var EducationList = React.createClass({
	componentWillMount: function(){
        var self = this;

        $.get("./data/educationAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
	},
	getInitialState: function() {
        return {
         
            attrs: [],
        }
    },
    render: function() {
        var educationList = null;
        if(this.props.educations != null)
        {
            educationList = this.props.educations.map(function(edu, index) {
                return (
                    <tr key={index}>
                        <td>{(edu.degreeNo != null) ? edu.degreeNo.value :(edu[this.state.attrs["degreeNo"]] != null ? edu[this.state.attrs["degreeNo"]].value : "")}</td>
                        
                        <td>
                            {(edu.startDate != null) ? edu.startDate.value :(edu[this.state.attrs["startDate"]] != null ? edu[this.state.attrs["startDate"]].value : "")}
                        </td>
						<td>
                            {(edu.endDate != null) ? edu.endDate.value :(edu[this.state.attrs["endDate"]] != null ? edu[this.state.attrs["endDate"]].value : "")}
                        </td>
						
						<td>{(edu && edu.enrollmentStatus) ? edu.enrollmentStatus.value : ""}</td>
						
                        <td>
                            <Button bsStyle="info" bsSize="sm" bsSize="xsmall" onClick={EducationActions.editEducation.bind(null, index)}>Edit</Button>
                        </td>

                    </tr>
                );
            }.bind(this));
        }
        return (
            <div>
                <div></div>
                <Table responsive>
					<thead>
						<tr>
							<th>degreeNo</th>
							<th>startDate</th>
							<th>endDate</th>
							<th>status</th>
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {educationList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = EducationList;