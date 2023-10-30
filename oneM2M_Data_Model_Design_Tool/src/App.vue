<template>
  <div class="row">
    <div class="col-8">
          <div style="height: 500px; width: 100%; border: 1px solid red; position: relative; padding: 25px;">
            
            <!-- <vue-draggable-resizable
            :w="300"
            :h="auto"
            :resizable="false"
            parent="true"
            dragHandle=".drag-handle"
            style="background-color:azure;"
            :x="100"
            :y="100"
            >
            <div class="drag-handle serverName">
              <p>CSE 1</p>  
            </div>
            <div>
              
            
            </div>
          </vue-draggable-resizable> -->
          <nestedDraggable 
            :tasks="cse1"
            style="padding-left: 0px;"
            :group="{name : 'cse', pull:'clone', put: true }"
            @change="log"
            :min-height="200"
            item-key="id"
            @end="moveTasks"
             >

             </nestedDraggable>
          
        </div>
    </div>
    <div class="col-2">
      <nestedDraggable
        class="dragArea resources list-items"
        :tasks="resources"
        style="padding-left: 0px;"
        :group="{name : 'cse', pull: 'none', put: false }"
        item-key="id"
        :clone="cloneResource"
        :move="validateMove"
        @end="moveTasks"
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


// import rawDisplayer from "./infra/raw-displayer.vue";

// import ResourceCanvas from "./components/ResourceCanvas.vue";
let idGlobal = 15;
const RT_CSE = 5;
const RT_AE = 2;
const RT_CNT = 3;
const RT_ACP = 4;
const RT_GRP = 5;
const RT_SUB = 16;
const RT_FCNT = 7;
const RT_TS = 8;
const RT_TSI = 9;
const RT_TSR = 10;
const RT_MGMTOBJ = 11;
const RT_NODE = 14;
let target = undefined;
let dragged = undefined;

export default {
  name: "App",
  display: "app",
  order: 3,
  components: {
    draggable,
    VueDraggableResizable,
    nestedDraggable
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
        { name: "CSE", id: 1, ty: RT_CSE, tasks: [
        { name: "AE", id: 2, ty: RT_AE, tasks:[
        ]  },
        { name: "CNT", id: 3, ty: RT_CNT },
        { name: "ACP", id: 4, ty: RT_ACP },
        { name: "GRP", id: 5, ty: RT_GRP },
        { name: "SUB", id: 6, ty: RT_SUB },
        { name: "FCNT", id: 7, ty: RT_FCNT },
        ] },
        
      ]
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    cloneResource(evt) {
      
      console.log("cloneResource", evt);
      return {
        id: idGlobal++,
        name: evt.name,
        ty: evt.ty,
        tasks: []
      };
    },
    moveTasks(){
    },
    validateMove(evt) {
      if(!this.isChildAvailable(evt.relatedContext.element.ty, evt.draggedContext.element.ty)){
        console.log("Child not available");
        return false;
      }
      if (evt.from == evt.to) return false;
      target = evt.relatedContext.element;
      dragged = evt.draggedContext.element;
      return true;
    },
    isChildAvailable(parent_ty, child_ty){
      console.log(parent_ty, child_ty);
      if(parent_ty == undefined) return false;
      switch(parent_ty){
        case RT_CSE:
          if(child_ty == RT_AE || child_ty == RT_ACP || child_ty == RT_GRP || child_ty == RT_SUB || child_ty == RT_FCNT || child_ty == RT_TS || child_ty == RT_TSI || child_ty == RT_TSR || child_ty == RT_MGMTOBJ || child_ty == RT_NODE){
            return true;
          }
          break;
        case RT_AE:
          if(child_ty == RT_CNT || child_ty == RT_ACP || child_ty == RT_GRP || child_ty == RT_SUB || child_ty == RT_FCNT || child_ty == RT_TS || child_ty == RT_TSI || child_ty == RT_TSR || child_ty == RT_MGMTOBJ || child_ty == RT_NODE){
            return true;
          }
          break;
        case RT_CNT:
          if(child_ty == RT_ACP || child_ty == RT_GRP || child_ty == RT_SUB || child_ty == RT_FCNT || child_ty == RT_TS || child_ty == RT_TSI || child_ty == RT_TSR || child_ty == RT_MGMTOBJ || child_ty == RT_NODE){
            return true;
          }
          break;
        case RT_ACP:
          return false;
        case RT_GRP:
          return false;
        case RT_SUB:
          return false;
      }
      
    },
    saveResourceTree(){
      console.log("saveResourceTree");

    },
    createResourceTree(){
      console.log("createResourceTree");
    }
  }
};
</script>
<style scoped>

.dragArea {
  border: 1px solid red;
  /* position: relative; */

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