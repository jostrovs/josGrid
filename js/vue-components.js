
Vue.component('vue-jos-grid', {
    template: `
        <div>
        <input type="checkbox" v-model="options.luokka.table">Table<br>
        <input type="checkbox" v-model="options.luokka['table-striped']">Table-striped<br>
        <input type="checkbox" v-model="options.luokka['table-bordered']">Table-bordered<br>
        <input type="checkbox" v-model="options.luokka['table-hover']">Table-hover<br>
        <input type="checkbox" v-model="options.luokka['table-condensed']">Table-condensed<br>
        
        <table :class="options.luokka" style="max-width: 500;">
            <thead>
                <tr>
                    <th v-for="column in columns" :class="{active: sortCol == column.key}">
                        <span @click="sortBy(column.key)">{{column.title}}</span>
                        <span v-if="sortIndicators[column.key]==1">Up</span>
                        <span v-if="sortIndicators[column.key]==-1">Down</span>
                        <br><input style="width: 80%;" type="text" v-model="filters[column.key]">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in filteredSortedData" :key="entry.josOrder">
                    <td v-for="column in columns">
                        <template v-if="column.type == 'text'">
                            Text: {{entry[column.key]}}
                        </template>
                        <template v-if="column.type == 'number'">
                            Number: {{entry[column.key]}}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    `,
    props: ['data', 'options'],

    // columnSetting:
    // {
    //     title: "Pitkä nimi",
    //     key: "nimi",
    //     type: text / number / date / jotain ihan muuta
    // }

    data: function () {
        this.options.luokka = {
            'table': true,
            'table-striped': true,
            'table-bordered': true,
            'table-hover': true,
            'table-condensed': true,
        };
        
        let columns = [];
        let sortIndicators = {};
        this.options.columns.forEach(function (column) {
            let localColumn = column;
            localColumn.josSortOrder=0;
            if(column.type == undefined) localColumn.type = "text";
            if(column.name == undefined) localColumn.name = column.key;
            columns.push(localColumn);
            sortIndicators[column.key]=0;
        });

        let localData = [];
        let c=1;
        if(this.data){
            this.data.forEach(function(item){
                item['josOrder'] = c++;
                localData.push(item);
            });
        }
        return {
            localData: localData,
            sortCol: '',
            sortOrder: 0,
            filters: {},
            columns: columns,
            sortIndicators: sortIndicators,
        }
    },
    computed: {
        filteredSortedData: function(){
            let ret = this.localData;
            for(let propertyName in this.filters){
                if(this.filters.hasOwnProperty(propertyName) == false) continue;
                let key = propertyName;
                let value = this.filters[key];

                ret = ret.filter(item => item[key].toString().indexOf(value) > -1);
            }

            for(let column of this.columns){
                if(column.name == this.sortCol){
                    if(this.sortOrder == 0){
                        ret = ret.sort((a,b)=>{
                            return a.josOrder-b.josOrder;
                        });
                    } else {
                        ret = ret.sort((a,b)=>{
                            let r = 0;
                            let v1 = a[column.key];
                            let v2 = b[column.key]; 
                            if(v1 < v2) r=-1;    
                            else if(v1 > v2) r=1;
                            return r*this.sortOrder;
                        });    
                    }
                }
            }

            return ret;
        },
    },
    methods: {
        sortBy: function (key) {
            this.sortIndicators = {};
            if(this.sortCol != key){
                this.sortCol = key;
                this.sortOrder = 1;
            } else {
                if(this.sortOrder == 1) this.sortOrder = -1;
                else if(this.sortOrder == -1) this.sortOrder = 0;
                else if(this.sortOrder == 0) this.sortOrder = 1;
            }
            this.sortIndicators[key] = this.sortOrder;
        }
      }
});

