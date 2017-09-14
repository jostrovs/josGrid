var bus = new Vue({
    methods: {
        on: function (event, callback) {
            this.$on(event, callback);
        },
        emit: function (event, payload) {
            this.$emit(event, payload);
        }
    }
});

$(document).ready(function () {
    var demo = new Vue({
        el: '#demo',
        data: {
            searchQuery: '',
            gridOptions: {
                columns: [
                    {
                        key: 'name',
                        title: 'Nimi'
                    },
                    {
                        key: 'power',
                        title: 'Kyky'
                    },
                    {
                        key: 'test',
                        title: 'Testi',
                        type: 'number'
                    },
                ],
                luokka: {
                },
            },
            gridData: [
                {
                    name: 'aaa Chuck Norris',
                    power: "Infinity",
                    test: 1,
                },
                {
                    name: 'aab Jackie Chan',
                    power: "Laughter",
                    test: 2,
                },
                {
                    name: 'bbc Remo',
                    power: "Sinanju",
                    test: 3,
                },
            ]
        }
    });
});