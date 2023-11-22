<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
  
        <!-- slot을 사용하여 부모 컴포넌트에서 전달한 내용을 여기에 표시합니다. -->
        <slot></slot>
      </div>
    </div>
  </template>
  