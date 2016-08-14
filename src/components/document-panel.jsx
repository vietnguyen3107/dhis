var React = require("react");
var DocumentForm = require("./document-form");
var DocumentList = require("./document-list");
var DocumentStore = require("../stores/document-store");



var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var moment = require("moment");

var DocumentPanel = React.createClass({
    
    _onChange: function() {
		if (this.isMounted()) {
			this.setState({
				documents: DocumentStore.getDocuments(),
			});
		}
		
    },
    getInitialState: function() {
        return {
            documents: [],
        }
    },
    componentDidMount: function() {
        DocumentStore.addChangeListenerDocument(this._onChange);
    },
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <DocumentForm />
                                </div>
                            </div>

                            <div className="row">
                                <div className='col-md-12'>
                                    <DocumentList documents={self.state.documents}/>
                                </div>
                            </div>
                  
                </div>
            </div>
        );
    }
});

module.exports = DocumentPanel;