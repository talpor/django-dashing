/*global Dashboard*/
var dashboard = new Dashboard();

dashboard.addWidget('clock_widget', 'Clock');

dashboard.addWidget('current_valuation_widget', 'Number', {
    getData: function () {
        this.data = {
            title: 'Current Valuation',
            more_info: 'In billions',
            updated_at: 'Last updated at 14:10',
            change_rate: '64%',
            value: '$35'
        };
        dashboard.publish('current_valuation_widget/render');
    }
});

dashboard.addWidget('buzzwords_widget', 'List', {
    getData: function () {
        this.data = {
            title: 'Buzzwords',
            more_info: '# of times said around the office',
            updated_at: 'Last updated at 18:58',
            data: [{'Exit strategy': 24}, {'Web 2.0': 12}, {'Turn-key': 2}, {'Enterprise': 12}, {'Pivoting': 3}, {'Leverage': 10}, {'Streamlininess': 4}, {'Paradigm shift': 6}, {'Synergy': 7}]
        };
        dashboard.publish('buzzwords_widget/render');
    }
});

dashboard.addWidget('convergence_widget', 'Graph', {
    getData: function () {
        this.data = {
            title: 'Convergence',
            value: '41',
            more_info: '',
            data: [ 
                    { x: 0, y: 40 }, 
                    { x: 1, y: 49 }, 
                    { x: 2, y: 38 }, 
                    { x: 3, y: 30 }, 
                    { x: 4, y: 32 }
                ]
            };
        dashboard.publish('convergence_widget/render');
    }
});
