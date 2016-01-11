var React = require("react");
var ResultForm = require("./result-form");
var ResultStore = require("../stores/result-store");


var ResultPanel = React.createClass({
   
    getInitialState: function() {
        return {
           
        }
    },
   
    render: function() {
        var self = this;
        return (
            <div className='row'>
                <div className='col-sm-12'>
                        
                            <div className="row">
                                <div className='col-md-12'>
                                    <ResultForm />
                                </div>
                            </div>

                          
                  
                </div>
            </div>
        );
    }
});

module.exports = ResultPanel;