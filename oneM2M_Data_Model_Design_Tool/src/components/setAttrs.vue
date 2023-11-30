<template>
<div>
    <div v-if="modalData.status" class="modal">
        <div class="overlay"></div>
        <div v-if="modalData.type == 'ACR'" class="modalBody">
            <setAcr 
            :acr_props="modalData.data.value"
            @modified="(value) => { 
                isModified=true;
            }"
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
                            if(value.length > 0) isModified = true;
                            content.value=value;
                            }"
                        >

                        </ArrayInput>
                    </div>
                    <div v-if="content.type=='Checkbox'" class="CheckboxInput">
                        <div v-for="option, optkey in content.options" class="Checkbox" :key="optkey">
                            <input type="checkbox" v-model="content.value" :key="idx" :value="optkey" @input="isModified=true">
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
import {resourceAttributes, resourceType as RT} from "@/components/attributes.js";
import { cloneDeep } from 'lodash';

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
            selectedElement:  {}, 
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
    mounted() {
        this.selectedElement = cloneDeep(resourceAttributes[this.element.ty]); 
        Object.entries(this.element.attrs).forEach(([key, value]) => {
            if(this.selectedElement[key])
                this.selectedElement[key].value = value;
        });
    },
    computed: {
    },
    watch: {
        isModified: function (val) {
            console.log("isModified", val);
            this.$emit('modified', val);
        }
        
    },
    methods: {
        validate: function (evt){
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