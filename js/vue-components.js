
Vue.component('vue-jos-grid', {
    template: `
        <div>
        SortOrder: {{sortOrder}}<br>
        SortCol: {{sortCol}}<br>
        <table>
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
        let columnNames = [];
        let columns = [];
        let sortIndicators = {};
        this.options.columns.forEach(function (column) {
            let localColumn = column;
            localColumn.josSortOrder=0;
            if(column.type == undefined) localColumn.type = "text";
            if(column.name == undefined) localColumn.name = column.key;
            columnNames.push(column.name);
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
            filters: {power: "nan"},
            columnNames: columnNames,
            columns: columns,
            fsd: localData,
            sortIndicators: sortIndicators,
        }
    },
    computed: {
        filteredData: function(){
            let ret = this.localData;
            for(let propertyName in this.filters){
                if(this.filters.hasOwnProperty(propertyName) == false) continue;
                let key = propertyName;
                let value = this.filters[key];
                console.log(key + ": " + value);

                ret = ret.filter(item => item[key].toString().indexOf(value) > -1);
            }

            if(this.filters) return ret;
            return ret;
        },
        filteredSortedData: function(){
            var ret = this.josData();
            return ret;
        },
    },
    methods: {
        josData: function(){
            let ret = this.localData;
            for(let propertyName in this.filters){
                if(this.filters.hasOwnProperty(propertyName) == false) continue;
                let key = propertyName;
                let value = this.filters[key];
                console.log(key + ": " + value);

                ret = ret.filter(item => item[key].toString().indexOf(value) > -1);
            }

            for(let column of this.columns){
                if(column.name == this.sortCol){
                    if(this.sortOrder == 0){
                        ret = ret.sort((a,b)=>{
                            return b.josOrder-a.josOrder;
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

            this.fsd=ret;
            
            for(let row of ret){
                console.log(row["test"]);
            }
            return ret;

        },
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

