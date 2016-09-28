/* global $, Dashboard */

var dashboard = new Dashboard();

dashboard.addWidget('clock_widget', 'Clock');

dashboard.addWidget('current_valuation_widget', 'Number', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Current Valuation',
            moreInfo: 'In billions',
            updatedAt: 'Last updated at 14:10',
            detail: '64%',
            value: '$35',
            icon: 'fa fa-arrow-up'
        });
    }
});

dashboard.addWidget('buzzwords_widget', 'List', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Buzzwords',
            moreInfo: '# of times said around the office',
            updatedAt: 'Last updated at 18:58',
            data: [{label: 'Exit strategy', value: 24},
                   {label: 'Web 2.0', value: 12},
                   {label: 'Turn-key', value: 2},
                   {label: 'Enterprise', value: 12},
                   {label: 'Pivoting', value: 3},
                   {label: 'Leverage', value: 10},
                   {label: 'Streamlininess', value: 4},
                   {label: 'Paradigm shift', value: 6},
                   {label: 'Synergy', value: 7}]
        });
    }
});

dashboard.addWidget('convergence_widget', 'Graph', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Convergence',
            value: '41',
            moreInfo: '',
            data: [ 
                    { x: 0, y: 40 }, 
                    { x: 1, y: 49 }, 
                    { x: 2, y: 38 }, 
                    { x: 3, y: 30 }, 
                    { x: 4, y: 32 }
                ]
            });
    }
});

dashboard.addWidget('completion_widget', 'Knob', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Completion',
            updatedAt: 'Last updated at 14:10',
            detail: 'today 10',
            value: '35',
            data: {
                angleArc: 250,
                angleOffset: -125,
                displayInput: true,
                displayPrevious: true,
                step: 1,
                min: 1,
                max: 99,
                readOnly: true,
                format: function(value) { return value + '%'; }
            }
        });
    }
});
