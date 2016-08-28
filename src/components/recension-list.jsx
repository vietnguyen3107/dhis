var React = require("react"),
    RecensionActions = require("../actions/recension-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var RecensionList = React.createClass({
	componentWillMount: function(){
        var self = this;

        $.get("./data/recensionAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
	},
	getInitialState: function() {
        return {
         
            attrs: [],
        }
    },
    render: function() {
        var recensionList = null;
        if(this.props.recensions != null)
        {
            recensionList = this.props.recensions.map(function(item, index) {
				var code = (item.code != null) ? item.code.value :(item[this.state.attrs["code"]] != null ? item[this.state.attrs["code"]].value : "");
                return (
                    <tr key={index}>
                        <td>{(item.code != null) ? item.code.value :(item[this.state.attrs["code"]] != null ? item[this.state.attrs["code"]].value : "")}</td>
                        
                        <td>
                            {(item.name != null) ? item.name.value :(item[this.state.attrs["name"]] != null ? item[this.state.attrs["name"]].value : "")}
                        </td>
						<td>
                            {(item.recensionChairPerson != null) ? item.recensionChairPerson.value :(item[this.state.attrs["recensionChairPerson"]] != null ? item[this.state.attrs["recensionChairPerson"]].value : "")}
                        </td>

                        <td>
                            <Button bsStyle="primary" bsSize="sm" bsSize="xsmall" onClick={RecensionActions.editRecension.bind(null, index)}><Glyphicon glyph="edit" /></Button>
                        &nbsp;
                        &nbsp;
                            <Button bsStyle="primary" bsSize="sm" bsSize="xsmall" onClick={RecensionActions.editDetailRecension.bind(null, index, { orgUnitUid: 'zmqii2FMVkS', recension : code})}>
							<Glyphicon glyph="list" />
							</Button>
                        </td>

                    </tr>
                );
            }.bind(this));
        }
        return (
            <div >
                <div></div>
                <Table responsive style={this.props.showStatus != "form" ? {display:'none'}: {}}>
					<thead>
						<tr>
							<th>Code</th>
							<th>Name</th>
							<th>Chair Person</th>
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {recensionList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = RecensionList;