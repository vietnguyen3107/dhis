var _ = require("underscore"),
EventEmitter = require('events').EventEmitter;

var _disciplines = [
    {value: '1179', label: 'Bác sỹ'}, 
    {value: '1180', label: 'Điều dưỡng viên'}, 
    {value: '19866', label: 'Kỹ thuật viên'}
];

var DisciplineStore  = _.extend(EventEmitter.prototype, {
    getDisciplines: function() {
        return _disciplines;
    }
});

module.exports = DisciplineStore;