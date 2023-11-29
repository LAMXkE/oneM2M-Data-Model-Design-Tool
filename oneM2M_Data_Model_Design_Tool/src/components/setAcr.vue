<!-- set ACR of oneM2M resource Access Control Policy -->
<template>
  <div class="row">
    <div class="col-9">
      <h2>Set ACR</h2>
    </div>
    <div class="col-3">
      <input type="button" value="Close" @click="$emit('close')">
      </div>
    <input type="button" value="Add ACR" @click="addAcr">
  </div>
  <div class="ACRbody">
    <div v-for="acr, idx in acr_list" class="ACRbox" :key="idx">
      <div class="row">
        <div class="col-12 acrNo">
          <p>
            ACR #{{ idx+1 }}
          </p>
          <p class="deleteBtn" @click="isModified=true; this.acr_list.splice(idx, 1)">
            <svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" viewBox="0 0 490.646 490.646" xml:space="preserve">
              <g>
                <g>
                  <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z     M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z"/>
                  <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z     M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z"/>
                </g>
              </g>
            </svg>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3 key">
          <p class="fullName">
            {{ acr.acor?.fullName }}
            <span class="tooltips">{{ acr.acop?.description }}</span>
          </p>
        </div>
        <div class="col-9 values">
          <ArrayInput
          :content="acr.acor"
          @input="(value) => { 
            isModified=true;
            acr.acor.value=value;
          }"
              >
            </ArrayInput>
          </div>
          
        </div>
        <div class="row">
          <div class="col-3 key">
            <p class="fullName">
              {{ acr.acop.fullName }}
              <span class="tooltips">{{ acr.acop.description }}</span>
            </p>
          </div>
          <div class="col-9 values CheckboxInput">
            <div v-for="option, key, idx in acr.acop.options" class="Checkbox" :key="idx">
              <input type="checkbox" v-model="acr.acop.selected" :key="idx" :value="key" @input="isModified=true">
              <span>
                {{ option }}
              </span>
            </div>
          </div>
        </div>
        <div class="row">
        </div>
      </div>
    </div>
      <div>
        <input type="button" value="Save" @click="saveAcr" />
      </div>
    </template>

<script>
import ArrayInput from "@/components/ArrayInput.vue";

export default {
  components:{
    ArrayInput
  },
  emits: ['save','modified', 'close'],
  props: {
    acr_props: {
      required: true,
      type: Array
    }
  },
  data(){
    return {
      acr_list: [],
      acr_structure: {  
        acop: {
            type: "Checkbox", 
            fullName:'Access Control Operations', 
            description: "Access Control Operations",
            required: true,
            options:{
              1: "Create",
              2: "Retrieve",
              4: "Update",
              8: "Delete",
              16: "Notify",
              32: "Discovery"
            },
            disable: false, 
            selected: [],
            value: 0
          },
        acor: {
          type: "Array", 
          fullName: "Access Control Originators",
          description: "Access Control Originators",
          required: true, 
          disable: false, 
          value: []
        },
        acco: {type: "Object", required:false, disable: false, placeholder:'Access Control Contexts', obj: {
                acip:{type: "Object", required:false, disable: false, obj: {
                        ipv4: {type: "Array", required:false, disable: false, value: []},
                        ipv6: {type: "Array", required:false, disable: false, value: []},
                    }
                },
            }
        },
      },
      isModified: false
    }
  },
  mounted(){
    var value = this.acr_props;
    var result = [];
    for(var i=0; i < value.length; i++){
      result.push(JSON.parse(JSON.stringify(this.acr_structure)));
      var acop = [];
      if(value[i].acop & 1) acop.push(1);
      if(value[i].acop & 2) acop.push(2);
      if(value[i].acop & 4) acop.push(4);
      if(value[i].acop & 8) acop.push(8);
      if(value[i].acop & 16) acop.push(16);
      if(value[i].acop & 32) acop.push(32);

      result[i].acop.selected = acop;
      result[i].acor.value = value[i].acor;
      result[i].acco.value = value[i].acco;
    }
    this.acr_list  = result;
  },
  computed: {
  },
  watch: {
    isModified: function(val){
      this.$emit('modified', val);
    }
  },
  methods: {
    saveAcr(){
      var result = [];
      for(var i=0; i<this.acr_list.length; i++){
        var acop = 0;
        for(var j = 0 ; j < this.acr_list[i].acop.selected.length ; j++){
          acop += parseInt(this.acr_list[i].acop.selected[j]);
        }
        result.push({
          acop: acop,
          acor: this.acr_list[i].acor.value,
          acco: this.acr_list[i].acco.value
        });
      }
      this.$emit('save', result);
    },
    addAcr() {
        this.acr_list.push(JSON.parse(JSON.stringify(this.acr_structure)));
    }
  }
}
</script>

<style>

.ACRbody {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    width: auto;
    overflow-y: auto;
    height: 400px;
}

.ACRbox {
    border: #333 1px solid;
    margin: 5px;
    padding: 5px;
    border-radius: 4px;

}

.acrNo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 40px !important;
  padding-right: 40px !important;
  font-weight: bold;
  font-size: 24px;
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
.deleteBtn {
    position: relative;
    text-align: right;
    cursor: pointer;
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
</style>