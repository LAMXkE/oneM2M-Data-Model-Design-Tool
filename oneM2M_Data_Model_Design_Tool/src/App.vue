<template>
  <header>
    <navBar class="nav" />
  </header>
  <div class="body">
    <div class="canvas">
        <nestedDraggable 
          :tasks="cse1"
          style="padding-left: 0px;"
          :group="{
                    name: 'resourceTree', 
                    pull: true,
                    put: true
                  }"
          :min-height="200"
          item-key="id"
          :clickMethod="setAttributes"
          @move="(evt) => { this.isDragging = true; return true; }"
          @drop="(evt) => { this.isDragging = false; return true; }"
          :dragoverBubble="true"
          class="dragArea resourceTree"
          >

          </nestedDraggable>
          <div class="trashcan" v-if="isDragging">

            <draggable
            :group="{
              name: 'trashcan',
              pull: (element) => {console.log(element); return true; },
              put: true,
            }"
              :list="[]"
              name="trashcan"
              class="dragArea"
              item-key="id"
              @change="(evt) => { isDragging = false; return evt;}"
              >
              <template #item="item">
                <div class="">{{ item }}</div>
                
              </template>
            </draggable>
            <svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" viewBox="0 0 490.646 490.646" xml:space="preserve">
                <g>
                  <g>
                    <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z     M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z"/>
                    <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z     M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z"/>
                  </g>
                </g>
              </svg>
          </div>
    </div>
    <div v-if="!attrSetting" class="rightTab">
      <nestedDraggable
        class="dragArea resources list-items"
        :tasks="resources"
        style="padding-left: 0px;"
        :group="{name:'resources', pull: 'clone', put: false}"
        item-key="id"
      >
      </nestedDraggable>
      <div class="buttonBox">
        <div class="btn button" style="background-color: aqua;" @click="createResourceTree">
          Create
        </div>
        <div class="btn button" style="background-color: aquamarine;" @click="saveResourceTree">
          Save
        </div>
      </div>
    </div>
    <div v-if="attrSetting" class="rightTab">
        <setAttrs 
        :element="selectedElement" 
        @modified="(status) => { this.attrSettingModified = status; }"
        @close="() => { this.attrSetting = false; this.selectedElement.selected=false; this.selectedElement = undefined; this.attrSettingModified = false;}"
        @save="(newElement, callback) => {
          this.attrSettingModified = false;
          Object.entries(newElement).forEach(([key, value]) => {
            if(value.value.length == 0)
              return;

            if(value.value == 0){
              return;
            }

            if(value.type == 'Number' && parseInt(value.value) != NaN && parseInt(value.value) != 0){
              this.selectedElement.attrs[key] = parseInt(value.value);
            }else{
              this.selectedElement.attrs[key] = value.value;
            }
            callback();
          });
        }"
        />
    </div>

  </div>
  <rawDisplayer class="col-4" :value="cse1" title="List 1" />

  <rawDisplayer class="col-4" :value="resources" title="List 2" />
</template>

<script>
import draggable from "vuedraggable";
import VueDraggableResizable  from "vue-draggable-resizable-vue3";
import nestedDraggable from "@/components/infra/nested.vue";
import setAttrs from "@/components/setAttrs.vue";
import navBar from "@/components/navBar.vue";
import get_jsonfile from "@/components/json-parser.js";

const RT_CSE = 5;
const RT_ACP = 1;
const RT_AE = 2;
const RT_CNT = 3;
const RT_GRP = 9;
const RT_SUB = 23;
const RT_FCNT = 7;
const RT_TS = 8;
const RT_TSI = 9;
const RT_TSR = 10;
const RT_MGMTOBJ = 11;
const RT_NODE = 14;


export default {
  name: "App",
  display: "app",
  order: 3,
  components: {
    navBar,
    draggable,
    VueDraggableResizable,
    nestedDraggable,
    setAttrs
    // rawDisplayer
  },
  data() {
    return {
      cse1: [
      {
          name: "CSE1",
          ty: RT_CSE,
          tasks: [
          ],
          attrs:{

          }
        }
      ],
      resources: [
        
          { name: "AE", id: 2, ty: RT_AE },
          { name: "CNT", id: 3, ty: RT_CNT },
          { name: "ACP", id: 4, ty: RT_ACP },
          { name: "GRP", id: 5, ty: RT_GRP },
          { name: "SUB", id: 6, ty: RT_SUB },
          { name: "FCNT", id: 7, ty: RT_FCNT },
      ]
      ,
      attrSetting : false,
      attrSettingModified: false,
      isDragging: false,
      selectedElement: {}
    };

  },
  created(){
    const cse = JSON.parse(sessionStorage.getItem("CSE1"));
    //get_jsonfile(cse);
    if (cse!=undefined) this.cse1 = cse;
  },
  methods: {
    log: function(evt) {
      // window.console.log(evt);
    },  
    saveResourceTree(){
      console.log("saveResourceTree");
      this.exportTextFile();
    },
    createResourceTree(){
      console.log("createResourceTree");
      this.create_oneM2M_resource();
     // console.log("create finish");
    },
    

    setAttributes(element){
      if(element == this.selectedElement){
        return;
      }
      if(this.attrSettingModified){
        if(confirm("Are you sure to switch without saving?")){
          this.selectedElement.selected = false;
          this.selectedElement = element;
          this.attrSettingModified = false;
          element.selected = true;
        }
      }else{
        if(this.selectedElement)
          this.selectedElement.selected = false;
        this.selectedElement = element;
        this.attrSettingModified = false;
        this.attrSetting = true;
        element.selected = true;
      }
    },
    create_oneM2M_resource()
    {
      const JSON_string = JSON.stringify(this.cse1);
      const dataToSave = JSON.parse(JSON_string);
      const filename = 'storagedata.json';
      const element = document.createElement('a');
      get_jsonfile(dataToSave);
      //console.log("create finish")
    },
    exportTextFile() {
      const dataToSave = sessionStorage.getItem('CSE1');
      const filename = 'storagedata.json';
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8, ' + encodeURIComponent(dataToSave));
      element.setAttribute('download', filename);
      document.body.appendChild(element);
      element.click();
    },
  },
  watch: {
    cse1 : {
      deep: true,
      handler(){
      sessionStorage.setItem("CSE1",JSON.stringify(this.cse1, null, 2));
      }
    }
  }
};
</script>
<style scoped>
#app{
  overflow: hidden;
}

.body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
}

.canvas {
  border: 1px solid black;
  width: 75%;
  height: 80vh;
  padding: 10px;
  margin: 10px;
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.rightTab {
  border: 1px solid black;
  width: 25%;
  height: 80vh;
  padding: 10px;
  margin: 10px;
  overflow: hidden;
  background-color: #eee;
  border-radius: 5px;

}
.nav {
  margin-bottom: 15px;
  min-width: 1200px;
  overflow: hidden;
}

.dragArea {
  border: 1px solid red;
  position: relative;

}

.resourceTree {
  flex-grow: 1;
}

.trashcan {
  height: 10%;
}

.trashcan .dragArea {
  height: 100%;
}
.trashcan svg{
  position: relative;
  left: 49%;
  bottom: 80%;
  width: 40px;
  height: 40px;
}

.serverName {
  background-color: #ccc;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.0;
  text-align: center;
  width: 120px;
}

.buttonBox {
  position: relative;
  bottom: 10px;
  right: 10px;
  width: 100%;
  text-align: center;
  padding: 10px;
}

.button {
  margin: 0px;
  padding: 10px;
}

.selectedBox {
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.0;
  text-align: center;
  width: 120px;
}


</style>