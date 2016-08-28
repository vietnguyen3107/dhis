var React = require("react"),
    DocumentActions = require("../actions/document-actions");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var DocumentList = React.createClass({
	componentWillMount: function(){
        var self = this;

        $.get("./data/documentAttributes.json", function (json){
            self.setState({attrs: json});
            
        });
        
	},
	getInitialState: function() {
        return {
         
            attrs: [],
        }
    },
    render: function() {
        var documentList = null;
        if(this.props.documents != null)
        {
            documentList = this.props.documents.map(function(entry, index) {
                return (
                    <tr key={index}>
                        <td>{(entry.docName != null) ? entry.docName.value :(entry[this.state.attrs["docName"]] != null ? entry[this.state.attrs["docName"]].value : "")}</td>
                        <td>{(entry.docMainVersion != null && entry.docMainVersion.value != "") ? entry.docMainVersion.value :(entry[this.state.attrs["docMainVersion"]] != null ? entry[this.state.attrs["docMainVersion"]].value : "false")}</td>
                        <td>{(entry.docSubVersion != null) ? entry.docSubVersion.value :(entry[this.state.attrs["docSubVersion"]] != null ? entry[this.state.attrs["docSubVersion"]].value : "false")}</td>
                       
                        <td>
                            <Button  bsSize="xsmall" onClick={DocumentActions.editDocument.bind(null, index)}><Glyphicon glyph="edit" /></Button>
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
							<th>document name</th>
							<th>Main version?</th>
							
							<th>#</th>
						</tr>
					</thead>
                    <tbody>
                        {documentList}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = DocumentList;