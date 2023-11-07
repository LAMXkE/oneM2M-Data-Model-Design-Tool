<template>
    <div class="titleBox">
        <h2>Attributes</h2>
        <div class="closeBtn" @click="confirmClose">
            <svg width="25px" height="25px" version="1.0" id="katman_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 1436 1054" style="enable-background:new 0 0 1436 1054;" xml:space="preserve">
            <path d="M718.5,453.8l224-224.3c20.4-20.4,53.3-20.4,73.6,0c20.4,20.4,20.4,53.3,0,73.6l-224,224.6l224,224
                c20.4,20.4,20.4,53.3,0,73.6c-20.4,20.4-53.3,20.4-73.6,0l-224-224l-224.6,224c-20.4,20.4-53.3,20.4-73.6,0
                c-20.4-20.4-20.4-53.3,0-73.6l224-224L420.4,303.2c-20.5-20.4-20.5-53.3-0.1-73.6s53.3-20.4,73.6,0l224.6,224V453.8z"/>
            </svg>
            
        </div>
    </div>
    <form @submit.prevent="validate" id="attrForm">
        <div>
            <div v-for="(content, key) in selectedElement" class="row" :key="key">
                <div class="col-2 key">{{ key }}</div>
                <div class="col-10 values">
                    <select :name="key" v-if="content.type == 'Select'" v-model="content.value" class="selectAttr">
                        <option v-for="option,key in content.options" :key="key" :value="option">{{ key }}</option>
                    </select>
                    <select :name="key" v-if="content.type == 'Boolean'" v-model="content.value" class="selectAttr">
                        <option :value="true">true</option>
                        <option :value="false">false</option>
                    </select>
                    <div v-if="content.type=='Array'" class="arrayInput">
                        <input :name="key" :disabled="content.disable" autocomplete="off" :required="content.required" v-on:keyup="(evt) => { addArrayItem(evt, content.value); } " />
                        <ul class="Arrayitems">
                            <li v-for="item, idx in content.value" :key="idx" class="item">
                                {{ item }}
                                <button class="arrayDelete" @click="content.value.splice(idx, 1)">x</button>
                            </li>
                        </ul>
                    </div>
                    <input v-if="content.type == 'String' || content.type == 'Number'" 
                    :name="key" 
                    :type="content.type" 
                    :disabled="content.disable" 
                    v-model="content.value" 
                    :required="content.required"
                    autocomplete="off"
                    
                    />
                </div>
            </div>
        </div>
        <div class="buttonBox">
            <div class="btn" @click="">
                <p><input type="submit" value="save" /></p>
            </div>
            <div v-if="this.element.ty != 5" class="delBtn">
                <p>delete</p>
            </div>
        </div>
    </form>
</template>

<script>
const RT_CSE = 5;
const RT_AE = 2;
const RT_CNT = 3;
const RT_ACP = 4;
const RT_GRP = 9;
const RT_SUB = 23;
const RT_FCNT = 7;
const RT_TS = 8;
const RT_TSI = 9;
const RT_TSR = 10;
const RT_MGMTOBJ = 11;
const RT_NODE = 14;

const resourceAttributes = {
    5: {
        'rn': {type: "String", required:false, disable: false, value: ''}, 
        'lbl': {type: "Array", required:false, disable: false, value: []}, 
        'csi': {type: "String", required:true, disable: false, value: ''}, 
        'cst': {type: "Select", options:{IN: 1, MN: 2, ASN: 3}, required:true, disable: false, value: ''},  
        'cb': {type: "String", required:true, disable: false, value: ''},
        'pi': {type: "String", required:false, disable: true, value: ''}, 
        'ri': {type: "String", required:false, disable: true, value: ''}, 
        'acpi': {type: "Array", required:false, disable: false, value: []},
        'ty': {type: "Number",  required:true, disable: true, value: 5},
    },
    2: {
        'rn': {type: "String", required:false, disable: false, value: ''},
        'aei': {type: "String", required:true, disable: false, value: '', validation: (value) => { return true },},
        'api': {type: "String", required:false, disable: false, value: ''},
        'apn': {type: "String", required:false, disable: false, value: ''},
        'at': {type: "String", required:false, disable: false, value: ''},
        'aa': {type: "Array", required:false, disable: false, value: []},
        'lbl': {type: "String", required:false, disable: false, value: ''},
        'acpi': {type: "Array", required:false, disable: false, value: []},
        'pi': {type: "String", required:false, disable: true, value: ''},
        'rr': {type: "Boolean", required:false, disable: false, value: false},
        'ty': {type: "Number", required:true, disable: true, value: 2},
        'poa': {type: "Array", required:false, disable: false, value: []},
        'nl': {type: "String", required:false, disable: false, value: ''},
    },
    3: {
        'rn': {type: "String", required:false, disable: false, value: ''},
        'pi': {type: "String", required:false, disable: true, value: ''},
        'ty': {type: "Number", required:true, disable: true, value: 3},
        'lbl': {type: "Array", required:false, disable: false, value: []},
        'acpi': {type: "Array", required:false, disable: false, value: []},
        'at': {type: "Array", required:false, disable: false, value: []},
        'aa': {type: "Array", required:false, disable: false, value: []},
        'cr': {type: "Boolean", required:false, disable: false, value: false},
        'mni': {type: "Number", required:false, disable: false, value: 0},
        'mbs': {type: "Number", required:false, disable: false, value: 0},
        'mia': {type: "Number", required:false, disable: false, value: 0}
    },
    9: {
        'aa': {type: "Array", required:false, disable: false, value: []},
        'rn': {type: "String", required:false, disable: false, value: ''},
        'pi': {type: "String", required:false, disable: true, value: ''},
        'ri': {type: "String", required:false, disable: true, value: ''},
        'ty': {type: "Number", required:true, disable: true, value: 9},
        'ct': {type: "String", required:false, disable: false, value: ''},
        'lt': {type: "String", required:false, disable: false, value: ''},
        'lbl': {type: "Array", required:false, disable: false, value: []},
        'acpi': {type: "Array", required:false, disable: false, value: []},
        'et': {type: "String", required:false, disable: false, value: ''},
        'st': {type: "Number", required:false, disable: false, value: 0},
        'cr': {type: "Boolean", required:false, disable: false, value: false},
        'mni': {type: "Number", required:false, disable: false, value: 0},
        'mbs': {type: "Number", required:false, disable: false, value: 0},
        'mia': {type: "Number", required:false, disable: false, value: 0}
    }

};

export default {
    props: {
        element: {
            type: Object,
            required: true,
        },
        close: {
            type: Function,
            required: true,
            default: () => {}
        },
        save: {
            type: Function,
            required: true,
            default: () => {}
        },
        setAttrModified: {
            type: Function,
            required: true,
            default: () => {}
        }

    },
    data() {
        return {
            selectedElement: JSON.parse(JSON.stringify(resourceAttributes[this.element.ty])),
            isModified: false,
        }
        
    },
    computed: {
    },
    watch: {
        element: {
            handler: function (val, oldVal) {
                this.selectedElement = JSON.parse(JSON.stringify(resourceAttributes[this.element.ty])); 
                this.isModified = false;
            },
            deep: true
        },
        selectedElement: {
            handler: function (val, oldVal) {
                if(this.isModified){
                    this.setAttrModified();
                }
                this.isModified = true;
            },
            deep: true
        }
    },
    methods: {
        validate: function (evt){
            console.log(evt);
            evt.preventDefault();
            console.log(this.selectedElement);
            // this.save(element);
        },
        submitForm: function(evt){
            const form = document.getElementById("attrForm");
            form.submit();
        },
        confirmClose(){
            if(this.isModified){
                if(confirm("Are you sure to leave without saving?\nAll the changes will be lost.")){
                    this.close();
                }
            }else{
                this.close();
            }
        },
        addArrayItem(evt, element){
            if(evt?.code =='Comma'){
                var str = evt.target;
                if(str.value.length < 0 || str.value == ""){
                    return;
                }
                str.value = str.value.replace(/,/g, "");
                if(str.value == ""){
                    return;
                }
                element.push(str.value);
                str.value = "";
            }
            // evt.target.__vnode.value push(evt.target.value);
            // this.buffer = "";
        },
    }
    
}

</script>

<style scoped>
.attrSetUi {
    /* overflow-y: auto; */
}

.selectAttr {
    width: 100%;
    text-align: left;
    border-bottom: #333 1px solid;
    border-top: #333 1px solid;
    border-radius: 2px;
}

.key {
    text-align: center;
    font-weight: bold;
    border-bottom: #333 1px solid;
    border-top: #333 1px solid;
}

.values {
    text-align: center;
    border-bottom: #333 1px solid;
    border-top: #333 1px solid;
    border-left: #333 1px solid;
    overflow: auto;
}

.values input {
    width: 100%;
    padding: 0%;
    margin: 0%;
}

.arrayInput {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;  
    box-sizing: border-box;
}

.Arrayitems {
  list-style: none;
  display: flex;
  flex-wrap: wrap ;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  margin: 0;
  padding: 0;
  white-space: inherit;
}

.arrayInput .divider {
    flex-basis: 100%;
}
.item {
    background-color: beige;
    margin: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border: black 1px solid;
    border-radius: 4px;
    white-space: nowrap;
}
.tag {
  background: rgb(250, 104, 104);
  padding: 5px;
  border-radius: 4px;
  color: white;
  white-space: nowrap;
  transition: 0.1s ease background;
}

.arrayDelete {
  color: black;
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
}
.closeBtn {
    display: block;
    position: absolute;
    right: 10px;
    cursor: pointer;
    padding: 5px;
}

.buttonBox {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    width: auto;
}

.delBtn {
    background-color: orangered;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;  
}

.btn {
    background-color: #333;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;  
}
</style>