var React = require("react");


var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Input = require("react-bootstrap").Input;
var moment = require("moment");


var DocumentStore = require("../stores/document-store");
var DocumentActions = require("../actions/document-actions");


    var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);
var DocumentForm = React.createClass({
    _onClickAdd: function() {
        DocumentActions.addDocument(this.state.editingDocument);
    },
    _onClickUpdate: function() {
        DocumentActions.updateDocument(this.state.editingDocument);
    },
    _onClickClear: function() {
        this.setState({
            editingDocument: null,
            editingPersonUid: null,
            editingDocumentUid: null
        });
    },


    _onChange: function(attr, e) {

        if(this.state.editingDocument == null ){
            this.state.editingDocument = {};
        }
        if(this.state.editingDocument[this.state.attrs[attr]] == null){
            this.state.editingDocument[this.state.attrs[attr]] = {};
            this.state.editingDocument[this.state.attrs[attr]].value = e.target.value;
            this.state.editingDocument[this.state.attrs[attr]].uid = this.state.attrs[attr];

        }else{
            this.state.editingDocument[this.state.attrs[attr]].value = e.target.value;
        }

        this.setState({
            editingDocument: this.state.editingDocument,
        });

    },


        _onChangeCheckbox: function(attr, e) {

            if(this.state.editingDocument == null ){
                this.state.editingDocument = {};
            }
            if(this.state.editingDocument[attr] == null){
                if(this.state.editingDocument[this.state.attrs[attr]] == null)
    			{
    				this.state.editingDocument[attr] = {};
    				this.state.editingDocument[attr].value = true;
    				this.state.editingDocument[attr].uid = this.state.attrs[attr];
    			}else{
    				this.state.editingDocument[this.state.attrs[attr]].value = !this.state.editingDocument[this.state.attrs[attr]].value;
    			}
            }else{
                this.state.editingDocument[attr].value = !this.state.editingDocument[attr].value;
            }


            this.setState({
                editingDocument: this.state.editingDocument,
            });

        },

    _onEdit: function() {
        var editingDocument = DocumentStore.getEditingDocument();

		if (this.isMounted()) {
			if(editingDocument && editingDocument.event ){
				this.setState({
					editingDocument: editingDocument,
					editingDocumentUid: editingDocument.event.value
				});
			}else{
				this.setState({
					editingDocumentUid: null,
					editingDocument: null,
				});
			}
        }
    },
    getInitialState: function() {
        return {
            isLoading: false,
            editingDocument: null,
            editingPersonUid : null,
            editingDocumentUid : null,
            DocumentTimes: [],
            hospitalTypes: [],
            standardHospitals: [],

        }
    },
    componentDidMount: function() {
        DocumentStore.addEditListenerDocument(this._onEdit);
        DocumentStore.addChangeListenerDocument(this._onEdit);
    },
    // component-will-mount :: a -> Void
    componentWillMount: function(){
        var self = this;

        $.get("./data/documentAttributes.json", function (json){
            self.setState({attrs: json});

        });


    },
    render: function() {
        var self = this;
        var btnAdd = (<Button bsStyle="primary" bsSize="sm" disabled={self.state.isLoading} onClick={self._onClickAdd}><Glyphicon glyph="arrow-down" />{self.state.isLoading? 'Loading...' : ' Save'}</Button>  );
        var btnUpdate = (<Button bsStyle="primary" bsSize="sm"  disabled={self.state.isLoading} onClick={self._onClickUpdate}><Glyphicon glyph="save" />{self.state.isLoading? 'Loading...' : ' Update'}</Button>);

        return (
            <form className="form">

			<div className="row">
                <div className="col-md-6 form-group-sm">
                    <label>docName</label>
                    <Input type="text" bsSize="small"
                        onChange={self._onChange.bind(this, 'docName')}
                        value=
                        {
                            (self.state.editingDocument && self.state.editingDocument.docName) ?
                                self.state.editingDocument.docName.value :
                                ((self.state.editingDocument && self.state.editingDocument.docName == null && self.state.editingDocument[self.state.attrs["docName"]]) ?
                                        self.state.editingDocument[self.state.attrs["docName"]].value  : "")
                        }
                    />

                </div>
				<div className="col-md-3 form-group-sm">

                    <label>Main version?  <br/>
					</label>
					<br/>

					<Button  bsSize="xsmall" onClick={self._onChangeCheckbox.bind(this, 'docMainVersion')}>
						{(self.state.editingDocument && self.state.editingDocument.docMainVersion) ?
                                ((self.state.editingDocument.docMainVersion.value + "" == "true") ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" /> ):
                                ((self.state.editingDocument && self.state.editingDocument.docMainVersion == null && self.state.editingDocument[self.state.attrs["docMainVersion"]]) ?
                                        ((self.state.editingDocument[self.state.attrs["docMainVersion"]].value + "" == "true") ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />): <Glyphicon glyph="unchecked" />)
						}
					</Button>

                </div>

				<div className="col-md-3 form-group-sm">

                    <label>Sub version?
					</label>
					<br/>


					<Button  bsSize="xsmall" onClick={self._onChangeCheckbox.bind(this, 'docSubVersion')}>
						{(self.state.editingDocument && self.state.editingDocument.docSubVersion) ?
                                ((self.state.editingDocument.docSubVersion.value + "" == "true") ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" /> ):
                                ((self.state.editingDocument && self.state.editingDocument.docSubVersion == null && self.state.editingDocument[self.state.attrs["docSubVersion"]]) ?
                                        ((self.state.editingDocument[self.state.attrs["docSubVersion"]].value + "" == "true") ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />): <Glyphicon glyph="unchecked" />)
						}
					</Button>

                </div>




            </div>

            <div className="row">
                <div className="col-md-12">
                   <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {self.state.editingDocumentUid ? btnUpdate : btnAdd}
                    <div  className="pull-right">
                    <Button  bsStyle="default" bsSize="sm"  bsSize="sm" onClick={self._onClickClear}>Clear</Button>
                    </div>
                </div>
            </div>

            </form>
        );
    }
});

module.exports = DocumentForm;
