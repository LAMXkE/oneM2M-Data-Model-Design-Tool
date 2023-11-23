<template>
<div>
    <div v-if="modalData.status" class="modal">
        <div class="overlay"></div>
        <div v-if="modalData.type == 'ACR'" class="modalBody">
            <setAcr 
            :acr_props="modalData.data.value"
            @close="() => { modalData.status=false; modalData.data=undefined; modalData.type=''; }"
            @save="(value) => {  
                modalData.data.value = value;
                }"
            />
        </div>
        <div v-if="modalData.type == 'LOAD'" class="modalBody">
            <loadFromRemote />
        </div>
    </div>
    <div class="titleBox">
        <p>{{ element.name }} Attributes</p>
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
                <div class="col-3 key">
                    <p class="fullName">
                        {{ content.fullName }}
                        <span class="tooltips">{{ content.description }}</span>
                    </p>

                </div>
                <div class="col-9 values">
                    <select :name="key" v-if="content.type == 'Select'" v-model="content.value" @keydown.enter.prevent="" @input="isModified=true" class="selectAttr">
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
                        <div class="btn" @click.stop @click="modalData.data=content; modalData.type='ACR'; modalData.status=true; ">
                            <p>set ACR</p>
                        </div>
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
                    @keydown.enter.prevent=""
                    />
                </div>
            </div>
        </div>
    </form>
    <div class="buttonBox">
        <!-- show modal loadFromRemote.vue when clicked -->
        <div class="btn" @click.stop @click="modalData.type='LOAD'; modalData.status=true" @loadData="(data) => { console.log(data); }" >
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
    0 : 'Mixed',
    1: 'ACP',
    2: 'AE',
    3: 'CNT',
    4: 'CIN',
    5: 'CSE',
    9: 'GRP',
    16: 'CSR',
    23: 'SUB'
}

const resourceAttributes = {
    5: {
        rn: {
            type: "text", 
            fullName: "Resource Name",
            description: "The name of the resource",
            required:false, 
            disable: false, 
            value: ''
        }, 
        lbl: {
            type: "Array", 
            fullName: "Label",
            description: "The label of the resource. Seperate with ,(comma)",
            required:false, 
            disable: false,
            value: []
        }, 
        csi: {
            type: "text", 
            fullName: "CSE ID",
            description: "The CSE ID of the resource",
            required:true, 
            disable: false, 
            value: ''
        }, 
        csz: {
            type: "Checkbox",
            fullName: "content Serialization",
            description: "The content serialization of the resource. At lease one should be selected",
            options:{0:"application/json", 1: "application/cbor", 2: "application/xml"},
            required:false,
            disable: false,
            value: [],
            validation: (value) => {
                if(value.length == 0)
                    return false;
                return true;
            }
        },
        poa : {
            type: "Array",
            fullName: "Point of Access",
            description: "The Point of Access of the resource",
            required:false,
            disable: false,
            value: []
        },
        srt : {
            type: "Checkbox",
            fullName: "Supported Resource Type",
            description: "The supported resource type of the resource",
            options: Object.entries(resourceType).filter(([key, value]) => {return key != 0}).map(([key, value]) => {return value}),
            required:false,
            disable: false,
            value: []
        },
        cst: {
            type: "Select", 
            fullName: "CSE Type",
            description: "The CSE Type of the resource",
            options:{1: 'IN', 2: 'MN', 3: 'ASN'}, 
            required:true, 
            disable: false, 
            value: 1
        },  
        cb: {
            type: "text", 
            fullName: "CSE Base",
            description: "The CSE Base of the resource",
            required:true, 
            disable: false, 
            value: ''
        },
        acpi: {
            type: "Array", 
            fullName: "Access Control Policy IDs",
            description: "Set AccessControlPolicy ID to the resource",
            required:false, 
            disable: false, 
            value: []
        },
        ty: {
            type: "Number", 
            fullName: "Resource Type",
            description: "The resource type of the resource",
            required:true, 
            disable: true, 
            value: 5
        },
    },
    1:{
        'rn': {
            type: "text", 
            fullName: "Resource Name",
            description: "The name of the resource",
            required:false, 
            disable: false, 
            value: ''
        },
        'lbl': {
            type: "Array", 
            fullName: "Label",
            description: "The label of the resource",
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'cr': {
            type: "Boolean", 
            fullName: "Creator",
            description: "Choose whether add creator attribute to the resource",
            required:false, 
            disable: false, 
            value: false
        },
        'pv ': {
            type: "ACR", 
            fullName: "Privileges",
            description: "The privilege setting of the resource using this AccessControlPolicy",
            required:false, 
            disable: false, 
            value: []
        },
        'pvs': {
            type: "ACR", 
            fullName: "Self-Privileges",
            description: "The privilege setting for this AccessControlPolicy resource",
            required:true, 
            disable: false, 
            value: []
        },
        'ty': {
            type: "Number", 
            fullName: "Resource Type",
            description: "The resource type of the resource",
            required:true, 
            disable: true, 
            value: 1
        },
    },
    2: {
        'rn': {
            type: "text", 
            fullName: "Resource Name",
            description: "The name of the resource",
            required:false, 
            disable: false, 
            value: ''
        },
        'aei': {
            type: "text", 
            fullName: "AE-ID",
            description: "The AE-ID of the resource",  
            required:true, 
            disable: false, 
            value: ''
            
        },
        'api': {
            type: "text",
            fullName: "App-ID",
            description: "The App-ID of the resource",
            placeholder: 'Should Start with N',
            required:false, 
            disable: false, 
            value: '',
            validation: function(value) { if(value[0] != 'N') return false; return true }
        },
        'apn': {
            type: "text", 
            fullName: "App-Name",
            description: "The App-Name of the resource",
            required:false, 
            disable: false, 
            value: ''
        },
        'at': {
            type: "Array", 
            fullName: "announceTo",
            description: "Set cse to announce this resource. Can be CSE-ID or URL",
            required:false, 
            disable: false, 
            value: [],
            validation: (value) => {
                if(value[0] == '/') return true;
                if(value.substring(0, 7) == 'http://') return true;
                if(value.substring(0, 7) == 'mqtt://') return true;
                if(value.substring(0, 7) == 'coap://') return true;
                return false;
            }
        },
        'aa': {
            type: "Array", 
            fullName: "Announced Attribute",
            description: "Attributes to announce",
            required:false, 
            disable: false, 
            value: [],
            validation: (value) => {
                console.log(Object.keys(resourceAttributes[resourceType.AE]));
                if(Object.keys(resourceAttributes[resourceType.AE]).indexOf(value) >= 0) return true;
                return false;
            }
        },
        'lbl': {
            type: "Array", 
            fullName: "Label",
            description: "The label of the resource",
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'acpi': {
            type: "Array", 
            fullName: "Access Control Policy IDs",
            description: "Resource ID or path of ACP resource to control access to this resource",
            required:false, 
            disable: false, 
            value: [],
            raw_value: ''
        },
        'rr': {
            type: "Boolean", 
            fullName: "Request Reachability",
            description: "Set whether the resource is reachable or not",
            required:false, 
            disable: false, 
            value: false
        },
        'srv': {
            type: "Checkbox", 
            fullName: "Supported Release Version",
            description: "Set supported Release Version",
            options:['1', '2', '2a', '3', '4', '5'], 
            required:true, 
            disable: false, 
            value: ['2a','3']
        },
        'poa': {
            type: "Array", 
            fullName: "Point of Access",
            description: "Set Point of Access",
            required:false, 
            disable: false, 
            value: [],  
            raw_value: ''},
        'ty': {
            type: "Number", 
            fullName: "Resource Type",
            description: "The resource type of the resource",
            required:true, 
            disable: true, 
            value: 2
        },
    },
    3: {
        'rn': {
            type: "text", 
            fullName: "Resource Name",
            description: "The name of the resource",
            required:false, 
            disable: false, 
            value: ''
        },
        'lbl': {
            type: "Array", 
            fullName: "Label",
            description: "The label of the resource",
            required:false, 
            disable: false, 
            value: []
        },
        'acpi': {
            type: "Array", 
            fullName: "Access Control Policy IDs",
            description: "Resource ID or path of ACP resource to control access to this resource",
            required:false, 
            disable: false, 
            value: []
        },
        'at': {
            type: "Array", 
            fullName: "announceTo",
            description: "Set cse to announce this resource. Can be CSE-ID or URL",
            required:false, 
            disable: false, 
            placeholder:'/CSE1 | http:// | mqtt:// | coap://', 
            value: [],
            validation: function (value) { 
                if(value[0] == '/') return true;
                if(value.substring(0, 7) == 'http://') return true;
                if(value.substring(0, 7) == 'mqtt://') return true;
                if(value.substring(0, 7) == 'coap://') return true;
                return false;
            }
        },
        'aa': {
            type: "Array", 
            fullName: "Announced Attribute",
            description: "Attributes to announce",
            required:false,
            disable: false, 
            value: [],
            validation: function (value) { 
                if(Object.keys(resourceAttributes[resourceType.CNT]).indexOf(value) >= 0) return true;
                return false;
            }
        },
        'cr': {
            type: "Boolean", 
            fullName: "Creator",
            description: "Choose whether add creator attribute to the resource",
            required:false, 
            disable: false, 
            value: false
        },
        'mni': {
            type: "Number", 
            fullName: "Max Nr of Instances",
            description: "The maximum number of instances of the resource",
            required:false, 
            disable: false, 
            value: 0,
            validation: function (value) { 
                if(value < 0) return false;
                return true;
            }
        },
        'mbs': {
            type: "Number", 
            fullName: "Max Byte Size",
            description: "The maximum byte size of the resource",
            required:false, 
            disable: false, 
            value: 0,
            validation: function (value) { 
                if(value < 0) return false;
                return true;
            }
        },
        'mia': {
            type: "Number", 
            fullName: "Max Instance Age",
            description: "The maximum instance age of the resource",
            required:false, 
            disable: false, 
            value: 0,
            validation: function (value) { 
                if(value < 0) return false;
                return true;
            }
        },
        'ty': {
            type: "Number", 
            fullName: "Resource Type",
            description: "The resource type of the resource",
            required:true, 
            disable: true, 
            value: 3
        },
    },
    9: {
        'rn': {
            type: "text", 
            fullName: "Resource Name",
            description: "The name of the resource",
            required:false, 
            disable: false, 
            value: ''
        },
        'mt': {
            type: "Select", 
            fullName: "Member Type",
            description: "The member type of the resource",
            options:resourceType, 
            required: true, 
            disable:false, 
            value: 0
        },
        'csy': {
            type: "Select", 
            fullName: "Consistency Strategy",
            description: "The consistency strategy of the resource",
            options: {
                1: 'Abandon Member', 
                2: 'Abandon Group', 
                3: 'Set Mixed'
            }, 
            required: false, 
            disable:false, 
            value: 0
        },
        'lbl': {
            type: "Array", 
            fullName: "Label",
            description: "The label of the resource",
            required:false, 
            disable: false, 
            value: [],
        },
        'acpi': {
            type: "Array", 
            fullName: "Access Control Policy IDs",
            description: "Resource ID or path of ACP resource to control access to this resource",
            required:false, 
            disable: false, 
            value: []
        },
        'cr': {
            type: "Boolean", 
            fullName: "Creator",
            description: "Choose whether add creator attribute to the resource",
            required:false, 
            disable: false, 
            value: false
        },
        'ty': {
            type: "Number", 
            fullName: "Resource Type",
            description: "The resource type of the resource",
            required:true, 
            disable: true, 
            value: 9
        },
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
            modalData: {
                status: false,
                type: '',
                data: {}
            }
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
    beforeMount() {
        window.addEventListener('beforeunload', () => { this.$emit('close', null); });
        // this.$emit('close', null);
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
            this.$emit('modified', val);
        }
        
    },
    methods: {
        validate: function (evt){
            // console.log(evt);
            evt.preventDefault();
            for (const [key, value] of Object.entries(this.selectedElement)) {
                if(value.required && value.value === ""){
                    alert(key + " is required");
                    return;
                }

                if(value.validation){
                    if(value.type === "Array" && value.value.length === 0) continue;
                    if(value.type === "text" && value.value === "") continue;

                    if(!value.validation(value.value)){
                        alert(key + " is not valid");
                        return;
                    }
                }
            }
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

.modal {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;

}

.modal .overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
}

.modal .modalBody {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 70vw;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px;
    min-height: 300px;
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

.fullName {
    position: relative;
}

.fullName .tooltips {
    /* display: none; */
    visibility: hidden;
    position: absolute;
    background-color: #333;
    color: #fff;
    text-wrap: nowrap;
    top: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
    z-index: 1;
    border-radius: 4px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.fullName:hover .tooltips{
    visibility: visible;

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