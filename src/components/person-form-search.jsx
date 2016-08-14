var React = require("react"),
    PersonStore = require("../stores/person-store"),
    PersonActions = require("../actions/person-actions"),
	Global = require('react-global');

var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;
var SimpleSelect = require('react-select');
var DatePicker = require("react-datepicker");
var moment = require("moment");

var Transition = require("react-overlays").Transition;

var _config = $.parseJSON($.ajax({
        type: "GET",
        dataType: "json",
        url: "./data/config.json",
        async: false
    }).responseText);


var PersonFormSearch = React.createClass({
    _onClickSearch: function() {
		this.setState({
			isLoading: true
		});
        PersonActions.searchPerson({firstName: this.state.nameSearch
            ,orgUnitUid: this.state.orgUnitUid
            ,applicationStatus : this.state.applicationStatus
            ,discipline : this.state.discipline
            , appDateFrom : this.state.appDateFrom
            , appDateTo : this.state.appDateTo
        });
    },

    _onChangeName: function(e) {
        this.setState({
            nameSearch: e.target.value,
        });
    },
    _onKeyDown: function(e) {
		if('13' == e.keyCode){
			this.setState({
				isLoading: true
			});
			PersonActions.searchPerson({firstName: this.state.nameSearch, orgUnitUid: this.state.orgUnitUid});
		}
    },
	_onChange: function(e) {

		if (this.isMounted()) {
  		this.setState({
              isLoading: false
          });
  		}
    },
	_onOrgUnitChange: function(val, e){
		//alert(this.props.me.organisationUnits[0].id);
		this.setState({
            orgUnitUid: val,
        });
		this.props.callbackParent(this.state);
    },

    _onApplicationStatusChange: function(val, e){
      this.setState({
            applicationStatus: val,
        });
    },

  _onDisciplineChange: function(val, e){

          this.setState({
                discipline: val,
            });
        },

                    _onAppDateFromChange: function( val, e){
                        val = val.format("DD/MM/YYYY");
                        this.setState({
                              appDateFrom: val,
                          });
                    },
            _onAppDateToChange: function( val, e){
                val = val.format("DD/MM/YYYY");
                this.setState({
                      appDateTo: val,
                  });
            },
    getInitialState: function() {
        return {
            nameSearch: "test",
			isLoading: false,
			orgUnits: [],
			orgUnitUid : "",
			me: null
        }
    },

    componentDidMount: function() {

        PersonStore.addChangeListener(this._onChange);

    },
	componentWillMount: function(){
        if(this.state.orgUnits.length > 0){
			this.setState({orgUnitUid: orgUnits[0].value});

		}
	},
	componentWillReceiveProps : function(props){
		var self = this;

		if(self.state.me == null || self.state.me.id != props.me.id){

			//orgUnits
			$.get("../../../../dhis/api/organisationUnits/" + props.me.organisationUnits[0].id + "?" + _config.orgUnitFieldSearch, function (xml){

				var orgUnits = [];
				{
					opt = {};
					opt.value = props.me.organisationUnits[0].id;
					opt.label = props.me.organisationUnits[0].name;

					orgUnits.push(opt);
				}
				var options = xml.children;
				options.forEach(function(entry) {
					opt = {};
					opt.value = entry.id;
					opt.label = entry.name;

					orgUnits.push(opt);

				});

				self.setState({orgUnits: orgUnits, me: props.me});

				self.setState({orgUnitUid: orgUnits[0].value});

        //applicationStatus
           $.get("../../../../dhis/api/optionSets/SCj9vq6xzYz?" + _config.optionFieldSearch, function (xml){

               var applicationStatuses = [];
               var options = xml.options;
               options.forEach(function(entry) {
                   applicationStatus = {};
                   applicationStatus.value = entry.code;
                   applicationStatus.label = entry.name;

                   applicationStatuses.push(applicationStatus);

               });

               self.setState({applicationStatuses: applicationStatuses});

           });


                   //disciplines
                      $.get("../../../../dhis/api/optionSets/vLyLsFHBomG?" + _config.optionFieldSearch, function (xml){

                          var disciplines = [];
                          var options = xml.options;
                          options.forEach(function(entry) {
                              discipline = {};
                              discipline.value = entry.code;
                              discipline.label = entry.name;

                              disciplines.push(discipline);

                          });

                          self.setState({disciplines: disciplines});

                      });
			});
		}
	},


    render: function() {
        var self = this;
        var btnSearch;

        if(self.state.isLoading){
             btnSearch = (<Button bsStyle="sm" ><img src="images/fb_loading.gif" height="18px"/> Searching...</Button>);
        }else
        {
        btnSearch = (<Button bsStyle="sm" onClick={self._onClickSearch} >Search</Button>);

        }

        return (

                <div>
                <div className="row">
                    <div className="col-md-12">
                        <label>OrgUnit</label>
                        <SimpleSelect
								name="orgUnit"
								options={self.state.orgUnits}
								onChange={self._onOrgUnitChange}
								value={self.state.orgUnitUid}

						></SimpleSelect>
                    </div>
                </div>

    <div className="row">

      <div className="col-md-12">
          <label>applicationStatus</label>
          <SimpleSelect
              name="applicationStatus"
              multi={true}
              delimiter=';'
              onChange={self._onApplicationStatusChange}
              options={self.state.applicationStatuses}
              value={(self.state.applicationStatus == null) ? [] : self.state.applicationStatus}
          />
      </div>
      </div>

    <div className="row">

    <div className="col-md-12">
        <label>Discipline</label>
        <SimpleSelect
            name="Discipline"
            multi={true}
            delimiter=';'
            onChange={self._onDisciplineChange}
            options={self.state.disciplines}
            value={(self.state.discipline == null) ? [] : self.state.discipline}
        />
    </div>
    </div>

         <div className="row">

         <div className="col-md-6">

            <label>appDate From</label>
            <DatePicker className="form-control"
                bsSize="small"
                onChange={self._onAppDateFromChange}
                selected={(self.state.appDateFrom) ? moment(self.state.appDateFrom, "DD/MM/YYYY") : null}

                dateFormat= "DD/MM/YYYY"/>


        </div>
        <div className="col-md-6">
                 <label>to</label>
               <DatePicker className="form-control"
                   bsSize="small"
                   onChange={self._onAppDateToChange}
                   selected={(self.state.appDateTo) ? moment(self.state.appDateTo, "DD/MM/YYYY") : null}

                   dateFormat= "DD/MM/YYYY"/>
        </div>
        </div>

                <div className="row">
                    <div className="col-md-12">
                        <label>Name</label>
                        <Input type="text"  bsSize="small"  value={self.state.nameSearch} onChange={self._onChangeName} onKeyDown={self._onKeyDown}  />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div  className="pull-right">
                            
                            {btnSearch}
                        </div>
                    </div>
                </div>
                </div>

        );
    }
});

module.exports = PersonFormSearch;
