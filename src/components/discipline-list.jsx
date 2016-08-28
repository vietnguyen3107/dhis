var React = require("react"),
    DisciplineActions = require("../actions/discipline-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;

var DisciplineList = React.createClass({
	componentWillMount: function(){
        var self = this;

        $.get("./data/disciplineAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
	},
	getInitialState: function() {
        return {
         
            attrs: [],
        }
    },
    render: function() {
        var disciplineList = null;
        if(this.props.disciplines != null)
        {
            disciplineList = this.props.disciplines.map(function(entry, index) {
                return (
                    <tr key={index}>
                        <td>{(entry.fromDate != null) ? entry.fromDate.value :(entry[this.state.attrs["fromDate"]] != null ? entry[this.state.attrs["fromDate"]].value : "")}</td>
                        <td>{(entry.toDate != null) ? entry.toDate.value :(entry[this.state.attrs["toDate"]] != null ? entry[this.state.attrs["toDate"]].value : "")}</td>
                        <td>{(entry.disciplineSigner != null) ? entry.disciplineSigner.value :(entry[this.state.attrs["disciplineSigner"]] != null ? entry[this.state.attrs["disciplineSigner"]].value : "")}</td>
           
                        <td>
                            <Button bsStyle="primary" bsSize="sm" bsSize="xsmall" onClick={DisciplineActions.editDiscipline.bind(null, index)}>Edit</Button>
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
							<th>signer</th>
							
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {disciplineList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = DisciplineList;