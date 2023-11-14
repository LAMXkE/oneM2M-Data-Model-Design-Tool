<template>
    <loadFromRemote :showModal="showModal" emits="showModal"/>
    <div>
    <div class="titleBox">
        <p>Attributes</p>
        <div class="closeBtn" @click="confirmClose">
            <svg width="25px" height="25px" version="1.0" id="katman_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1436 1054" style="enable-background:new 0 0 1436 1054;" xml:space="preserve">
                <path d="M718.5,453.8l224-224.3c20.4-20.4,53.3-20.4,73.6,0c20.4,20.4,20.4,53.3,0,73.6l-224,224.6l224,224
                c20.4,20.4,20.4,53.3,0,73.6c-20.4,20.4-53.3,20.4-73.6,0l-224-224l-224.6,224c-20.4,20.4-53.3,20.4-73.6,0
                c-20.4-20.4-20.4-53.3,0-73.6l224-224L420.4,303.2c-20.5-20.4-20.5-53.3-0.1-73.6s53.3-20.4,73.6,0l224.6,224V453.8z"/>
            </svg>
        
        </div>
    </div>
    <form @submit="validate" id="attrForm">
        <div class="attrBox">
            <div v-for="(content, key) in selectedElement" class="attrRow" :key="key">
                <div class="col-2 key">{{ key }}</div>
                <div class="col-10 values">
                    <select :name="key" v-if="content.type == 'Select'" v-model="content.value" @input="isModified=true" class="selectAttr">
                        <option v-for="option2,key2 in content.options" :key="key2" :value="key2">{{ option2 }}</option>
                    </select>
                    <select :name="key" v-if="content.type == 'Boolean'" v-model="content.value" class="selectAttr" @input="isModified=true">
                        <option :value="true">true</option>
                        <option :value="false">false</option>
                    </select>
                    <div v-if="content.type=='Array'" class="arrayInput">
                        <ArrayInput
                        :content="content"
                        @input="(value) => { 
                            isModified=true;
                            content.value=value;
                            }"
                        >

                        </ArrayInput>
                    </div>
                    <div v-if="content.type=='Checkbox'" class="CheckboxInput">
                        <div v-for="option, idx in content.options" class="Checkbox" :key="idx">
                            <input type="checkbox" v-model="content.value" :key="idx" :value="option" @input="isModified=true">
                            <span>
                                {{ option }}
                            </span>
                        </div>
                    </div>
                    <div v-if="content.type=='ACR'" class="">
                        <setAcr></setAcr>
                    </div>
                    <input v-if="content.type == 'text' || content.type == 'Number'" 
                    :name="key" 
                    :type="content.type" 
                    :placeholder="content.placeholder"
                    :disabled="content.disable" 
                    v-model="content.value" 
                    :required="content.required"
                    autocomplete="off"
                    @input="isModified=true"
                    />
                </div>
            </div>
        </div>
    </form>
    <div class="buttonBox">
        <!-- show modal loadFromRemote.vue when clicked -->
        <div class="btn" @click="showModal=true" @loadData="(data) => { this.selectedElement = data; }" >
            <p>load</p>
        </div>

        <div class="btn" @click="validate">
            <p>save</p>
        </div>
    </div>
</div>
</template>

<script>
import loadFromRemote from "@/components/loadFromRemote.vue";
import setAcr from "./setAcr.vue";
import ArrayInput from "./ArrayInput.vue";

import deepClone from 'lodash';
const resourceType = {
    Mixed: 0,
    ACP: 1,
    AE: 2,
    CNT: 3,
    CIN: 4,
    CSE: 5,
    GRP: 9,
    CSR: 16,
}

const resourceAttributes = {
    5: {
        rn: {type: "text", required:false, disable: false, placeholder:'Resource Name', value: ''}, 
        lbl: {type: "Array", required:false, disable: false, placeholder:'Label', value: []}, 
        csi: {type: "text", required:true, disable: false, placeholder:'CSE ID', value: ''}, 
        cst: {type: "Select", options:{1: 'IN', 2: 'MN', 3: 'ASN'}, required:true, disable: false, value: 1},  
        cb: {type: "text", required:true, disable: false, placeholder:'CSE Base', value: ''},
        pi: {type: "text", required:false, disable: true, value: ''}, 
        ri: {type: "text", required:false, disable: true, value: ''}, 
        acpi: {type: "Array", required:false, disable: false, placeholder:'AccessControlPolicy IDs', value: []},
        ty: {type: "Number",  required:true, disable: true, value: 5},
    },
    1:{
        'rn': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'lbl': {
            type: "Array", 
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'cr': {
            type: "Boolean", 
            required:false, 
            disable: false, 
            value: false
        },
        'pv ': {
            type: "ACR", 
            required:false, 
            disable: false, 
            obj: {
                type: "Object",                
            }
        },
        'pvs': {
            type: "Object", 
            required:true, 
            disable: false, 
            obj: {
                type: "Object",
                acr: {type: "Array", required:false, disable: false, value: []},
                acor: {type: "Array", required:false, disable: false, value: []},
                acop: {type: "Number", required:false, disable: false, value: 0},
                acco: {type: "Object", required:false, disable: false, obj: {}},
            }
        },
        'ty': {
            type: "Number", 
            required:true, 
            disable: true, 
            value: 1
        },
    },
    2: {
        'rn': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'aei': {
            type: "text", 
            required:true, 
            disable: false, 
            value: '', 
            validation: function(value) { if(value[0] != 'N') return false; return true }
        },
        'api': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'apn': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'at': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'aa': {
            type: "Array", 
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'lbl': {
            type: "Array", 
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'acpi': {
            type: "Array", 
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'rr': {
            type: "Boolean", 
            required:false, 
            disable: false, 
            value: false
        },
        'srv': {
            type: "Checkbox", 
            options:['1', '2', '2a', '3', '4', '5'], 
            required:true, 
            disable: false, 
            value: ['2a','3']
        },
        'poa': {
            type: "Array", 
            required:false, 
            disable: false, 
            value: [],  
            raw_value: ''},
        'nl': {
            type: "text", 
            required:false, 
            disable: false, 
            value: ''
        },
        'ty': {
            type: "Number", 
            required:true, 
            disable: true, 
            value: 2
        },
    },
    3: {
        'rn': {type: "text", required:false, disable: false, value: ''},
        'lbl': {type: "Array", required:false, disable: false, value: []},
        'acpi': {type: "Array", required:false, disable: false, value: []},
        'at': {type: "Array", required:false, disable: false, placeholder:'/CSE1 | http:// | mqtt:// | coap://', value: [],
                validation: function (value) { 
                    if(value[0] == '/') return true;
                    if(value.substring(0, 7) == 'http://') return true;
                    if(value.substring(0, 7) == 'mqtt://') return true;
                    if(value.substring(0, 7) == 'coap://') return true;
                    return false;
                }
        },
        'aa': {type: "Array", required:false, disable: false, value: []},
        'cr': {type: "Boolean", required:false, disable: false, value: false},
        'mni': {type: "Number", required:false, disable: false, value: 0},
        'mbs': {type: "Number", required:false, disable: false, value: 0},
        'mia': {type: "Number", required:false, disable: false, value: 0},
        'ty': {type: "Number", required:true, disable: true, value: 3},
    },
    9: {
        'rn': {type: "text", required:false, disable: false, value: ''},
        'ty': {type: "Number", required:true, disable: true, value: 9},
        'ct': {type: "text", required:false, disable: false, value: ''},
        'lt': {type: "text", required:false, disable: false, value: ''},
        'mt': {type: "Select", options:resourceType, required: true, disable:false, value: 0},
        'csy': {type: "Select", options:{1: 'Abandon Member', 2: 'Abandon Group', 3: 'Set Mixed'}, required: false, disable:false, value: 0},
        'lbl': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'acpi': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'cr': {type: "Boolean", required:false, disable: false, value: false},
    },
    23: {
        'rn': {type: "text", required:false, disable: false, value: ''},
        'ty': {type: "Number", required:true, disable: true, value: 23},
        'ct': {type: "text", required:false, disable: false, value: ''},
        'lbl': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'acpi': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'nu': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'nct': {type: "Select", options:{1: 'All Attributes', 2: 'Modified Attributes', 3: 'Resource ID', 4: 'Trigger_Payload', 5: 'TimeSeries notification'}, required: true, disable:false, value: 0},
        'su': {type: "Array", required:false, disable: false, value: [], raw_value: ''},
        'enc': {type: "Select", options:{None: 0, Base64: 1}, required: true, disable:false, value: 0},

    },
};

export default {
    name: "setAttrs",
    "emits": ["close", "save", "modified"],
    components:{
        loadFromRemote,
        setAcr,
        ArrayInput
    },
    props: {
        element: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            sE:  deepClone(resourceAttributes[this.element.ty]).__wrapped__, 
            isModified: false,
            showModal: false,
        }
        
    },
    beforeMount() {
        window.addEventListener('beforeunload', () => { this.$emit('close', null); });
        // this.$emit('close', null);
    },
    computed: {
        selectedElement: {
            get: function () {
                return this.sE;
            },
            set: function (newValue) {
                Object.entries(this.element.attrs).forEach(([key, value]) => {
                    if(newValue[key])
                        newValue[key].value = value;
                });
                this.sE = newValue;
                return this.sE;
            }
        }
    },
    watch: {
        element: {
            handler: function (val, oldVal) {
                this.selectedElement = JSON.parse(JSON.stringify(resourceAttributes[this.element.ty])); 
                this.isModified=false;
            },
            deep: true
        },

        isModified: function (val, oldVal) {
            console.log(val);
            this.$emit('modified', val);
        }
        
    },
    methods: {
        validate: function (evt){
            // console.log(evt);
            evt.preventDefault();
            for (const [key, value] of Object.entries(this.selectedElement)) {
                console.log(value);
                if(value.required && value.value === ""){
                    // console.log(key, value.value);
                    alert(key + " is required");
                    return;
                }
                // console.log(key, value);
                // console.log(value.validation);
                if(value.validation){
                    console.log(value.validation(value.value));
                    if(!value.validation(value.value)){
                        alert(key + " is not valid");
                        return;
                    }
                }
            }
            // console.log(this.selectedElement);
            this.$emit('save', this.selectedElement, ()=>{this.isModified = false;});
            this.isModified = false;
        },
        confirmClose(){
            if(this.isModified){
                if(confirm("Are you sure to leave without saving?\nAll the changes will be lost.")){
                    this.$emit('close', null);
                }
            }else{
                this.$emit('close', null);
            }
        },
    }
}

</script>

<style scoped>
.attrSetUi {
    /* overflow-y: auto; */
}

.titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;

    border-bottom: #333 1px solid;
}

.titleBox p {
    font-size: 25px;
    font-weight: bold;
    margin: 0;
    padding: 0;
}

.attrBox {
    overflow-y: auto;
    max-height: 500px;
    display: flex;
    flex-direction: column;

}

.attrBox .attrRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
    padding: 5px;
    border-bottom: #333 1px solid;
    /* border-top: #333 1px solid; */
}

.selectAttr {
    width: 100%;
    text-align: left;
    
}

.key {
    text-align: center;
    font-weight: bold;
}

.values {
    text-align: center;
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

.closeBtn {
    cursor: pointer;
    padding: 5px;
}

.buttonBox {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    width: auto;
}

.CheckboxInput {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

}

.CheckboxInput .Checkbox {

    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
    gap: 5px;
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
    border-radius: 5px;
    cursor: pointer;  
}

.btn p{
    padding: 0;
    margin: 0;
}
</style>