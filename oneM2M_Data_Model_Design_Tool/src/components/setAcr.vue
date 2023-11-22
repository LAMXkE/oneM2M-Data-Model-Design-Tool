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
  <div v-for="acr, idx in acrs" class="ACRbox" :key="idx">
    <div class="row">
      <div class="col-12 acrNo">
        <p>
          ACR #{{ idx+1 }}
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-3 key">
          <p class="fullName">
              {{ acr.acor.fullName }}
              <span class="tooltips">{{ acr.acop.description }}</span>
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
  <div>
    <input type="button" value="Set ACR" @click="saveAcr" />
  </div>
</template>

<script>
import { sum } from 'lodash';
import ArrayInput from "@/components/ArrayInput.vue";

export default {
  components:{
    ArrayInput
  },
  emits: ['save', 'close'],
  props: {
    acr_props: {
      required: true,
      type: Array
    }
  },
  data(){
    return {
      acrs: this.acr_props,
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
                32: "Discover"
              },
              disable: false, 
              selected: [],
              value: sum(this.selected)
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
    }
  },
  methods: {
    saveAcr(){
      // console.log(this.acrs);
      this.$emit('save', this.acrs);
    },
    addAcr() {
        this.acrs.push(JSON.parse(JSON.stringify(this.acr_structure)));
    }
  }
}
</script>

<style>
.ACRbox {
    border: #333 1px solid;
    margin: 5px;
    padding: 5px;
    border-radius: 4px;

}

.acrNo {
    text-align: center;
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