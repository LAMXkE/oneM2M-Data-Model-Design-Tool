<template>
  <div class="row">
    <div class="col-8">
          <div style="height: 500px; width: 100%; border: 1px solid red; position: relative; padding: 25px;">
            
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
            :dragoverBubble="true"
             >

             </nestedDraggable>
          
        </div>
    </div>
    <div class="col-2">
      <nestedDraggable
        class="dragArea resources list-items"
        :tasks="resources"
        style="padding-left: 0px;"
        :group="{name:'resources', pull: 'clone', put: false}"
        item-key="id"
      >
      </nestedDraggable>
      <div class="buttonBox">
        <div class="button" style="background-color: aqua;" @click="createResourceTree">
          Create
        </div>
        <div class="button" style="background-color: aquamarine;" @click="saveResourceTree">
          Save
        </div>
      </div>
    </div>

    <rawDisplayer class="col-3" :value="cse1" title="List 1" />

    <rawDisplayer class="col-3" :value="resources" title="List 2" />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import VueDraggableResizable  from "vue-draggable-resizable-vue3";
import nestedDraggable from "@/components/infra/nested.vue";

const RT_CSE = 5;
const RT_AE = 2;
const RT_CNT = 3;
const RT_ACP = 4;
const RT_GRP = 9;
const RT_SUB = 16;
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
    draggable,
    VueDraggableResizable,
    nestedDraggable,
    // rawDisplayer
},
  data() {
    return {
      cse1: [
      {
          name: "CSE1",
          ty: RT_CSE,
          parent: undefined,
          tasks: [
          ]
        }
      ],
      resources: [
        
          { name: "AE", id: 2, ty: RT_AE, tasks:[
          ]  },
          { name: "CNT", id: 3, ty: RT_CNT },
          { name: "ACP", id: 4, ty: RT_ACP },
          { name: "GRP", id: 5, ty: RT_GRP },
          { name: "SUB", id: 6, ty: RT_SUB },
          { name: "FCNT", id: 7, ty: RT_FCNT },
         
        
      ]
    };

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
  }
};
</script>
<style scoped>

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