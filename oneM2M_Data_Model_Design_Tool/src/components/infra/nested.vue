<template>
    <draggable
      class="dragArea"
      tag="ul"
      :list="tasks"
      :clone="cloneResource"
      :group="{ name: 'cse', pull: 'clone', put: true }"
      @change="log"
      item-key="name"
    >
      <template #item="{ element }">
        <li class="resourceBox">
          <p>{{ element.name }}</p>
          <nested-draggable :tasks="element.tasks" />
        </li>
      </template>
    </draggable>
  </template>
  <script>
  import draggable from "vuedraggable";


  export default {
    props: {
      tasks: {
        required: true,
        type: Array
      },
    },
    components: {
      draggable
    },
    name: "nested-draggable"
    ,
    methods: {
        moveTasks(evt){
            console.log(evt);
      },
      log(evt) {
        console.log(evt);
      },
      cloneResource(evt) {
        console.log("cloneResource", evt);

        return {
          name: evt.name,
          ty: evt.ty,
          tasks: []
        }
      }
    }
  };
  </script>
  <style scoped>
   .dragArea {
    min-height: 20px;
    /* outline: 1px dashed; */
  } 
  .resources .resourceBox .dragArea {
  padding-left: 0px;
  min-height: 0px !important;
  outline: 0px !important;
}
  .resourceBox {
    list-style-type: none;
  }

  .resourceBox p{
    min-height: 50px;
    outline: 1px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    width: 120px;
    min-height: 30px;
    margin: 5px;
  }
  </style>