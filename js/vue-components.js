
Vue.component('vue-jos-grid', {
    template: `
        <div class="jos-table-container">
        <table :class="options.luokka" style="max-width: 500;">
            <thead>
                <tr>
                    <th v-for="column in columns" :class="{active: sortCol == column.key}">
                        <span @click="column.sortable != false && sortBy(column.key)">{{column.title}}</span>
                        <span v-if="sortIndicators[column.key]==1">Up</span>
                        <span v-if="sortIndicators[column.key]==-1">Down</span>
                        
                        <template v-if="column.filterable != false">
                            <br><input style="width: 80%;" type="text" v-model="filters[column.key]">
                        </template>
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
                        <template v-if="column.type == 'link'">
                            Link: <a :href="entry[column.key].href">{{entry[column.key].text}}</a>
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
            'table': false,
            'table-striped': false,
            'table-bordered': false,
            'table-hover': false,
            'table-condensed': false,

            'jos-table': true,
        };
        
        let columns = [];
        let filters = {};
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
            columns: columns,
            sortIndicators: sortIndicators,
            filters: filters,
        }
    },
    computed: {
        filteredSortedData: function(){
            let self = this;
            let ret = this.localData;
            for(let column of this.columns){
                ret = this.filterByColumn(column, ret);
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
                            let v1 = self.getVal(column, a[column.key]);
                            let v2 = self.getVal(column, b[column.key]); 
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
        },
        getVal: function(column, entry){
            if(column.type == 'link') return entry.text;
            return entry;
        },
        filterByColumn: function(column, data){
            let filter = this.filters[column.key];
            if(filter == undefined || filter.length < 1) return data;
            let ret = data; 
          
            ret = ret.filter(item =>{
                let val = this.getVal(column, item[column.key]);
                if(val == undefined) val = "";
                val=val.toString();
                return val.indexOf(this.filters[column.key]) > -1;
            });
            return ret;
        }
    },
});

