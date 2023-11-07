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
          :dragoverBubble="true"
          >

          </nestedDraggable>
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
        :setAttrModified="setAttrModified"
        :close="() => { this.attrSetting = false; this.selectedElement = undefined; this.attrSettingModified = false;}"
        :save="(newElement) => {
          console.log(newElement);
          for ( element in newElement) {
            console.log(element);
            this.selectedElement[key].value = value;
          }
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
          ]
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
      selectedElement: {}
    };
  },
  methods: {
    log: function(evt) {
      // window.console.log(evt);
    },
    saveResourceTree(){
      console.log("saveResourceTree");

    },
    createResourceTree(){
      console.log("createResourceTree");
    },
    setAttributes(element){
      if(element == this.selectedElement){
        return;
      }
      if(this.attrSettingModified){
        if(confirm("Are you sure to switch without saving?")){
          this.selectedElement = element;
          this.attrSettingModified = false;
        }
      }else{
        this.selectedElement = element;
        this.attrSetting = true;
      }
    },
    setAttrModified(){
      this.attrSettingModified = true;
    }
  },
  watch: {
  }
};
</script>
<style scoped>
.body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px;
  width: 100%;
  height: 100%;
  min-width: 1200px;
}

.canvas {
  border: 1px solid black;
  width: 75%;
  height: 80vh;
  padding: 10px;
  margin: 10px;
  overflow: auto;
  background-color: #eee;
  border-radius: 5px;
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
}

.dragArea {
  border: 1px solid red;
  position: relative;

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


</style>