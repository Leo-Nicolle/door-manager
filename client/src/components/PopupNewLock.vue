<template>
  <span class="lock" v-if = "newLock">
    <p class = 'long-button validate' @click="onClickMessage">Nouvelle serrure: <b>{{newLock.ip}}</b>.</p>
    <Modal v-if="modalVisible">
      <h3>Assigner une Porte a la nouvelle serrure</h3>
      <b>{{selectedDoor ? selectedDoor.name: ' '}}</b>

      <ul class = 'doorlist'>
        <li class='doorname' 
          v-for="(door, i) in doors" 
          :key = "i"
          @click="onSelect(door)">
          {{ door.name }}
        </li>

      </ul> 
      <div class="footer">
      <button @click="onCancel">annuler</button>
      <button @click="onConfirm">valider</button>

    </div>
    </Modal>
  </span>
</template>

<script>
import axios from "axios";
import { getUrl } from "../js/utils";
import Modal from "./Modal";


export default {
  name: "PopupNewLock",
  data(){
    return {newLocks: [], modalVisible: false, doors: [], selectedDoor: null};
  },
  computed: {
    newLock: function(){
      return this.newLocks[0];
    }
  },
  methods: {
    fetch(){
      axios
      .get(getUrl('lock'))
      .then(({ data }) => {
        this.newLocks = data.filter(({doorId}) => !doorId);
        this.locks = data;
      }).catch(() => {})

      axios
      .get(getUrl('door'))
      .then(({ data }) => {
        this.doors = data.filter(({id}) => !this.locks.find(({doorId}) => doorId === id));
      }).catch(() => {});
    },
    onClickMessage(){
      this.selectedDoor = false;
      this.modalVisible = true;
    },
    onSelect(door){
      this.selectedDoor = door; 
    },
    onConfirm(){
      axios.post(getUrl('lock'), {
        ...this.newLock,
        doorId: this.selectedDoor.id
      }).then(() => {
        this.fetch();
        this.modalVisible = false;
      })
    },
    onCancel(){
      this.modalVisible = false;
    }
  },
  mounted(){
    setInterval(() => {
      this.fetch();
    },1000);
  },
  components:{
    Modal
  }
};
</script>
<style>
.lock{
  display: flex;
}
.long-button{
  cursor: pointer;
  width: 100%;
  margin: 5px 12px;
  padding: 5px 0;

  border-radius: 5px;
}
.newlock{
  display: flex;
  width: 100%;
}
.newlock > p{  
  padding: 0.5em 0;
  border-radius: 5px;
  cursor: pointer;
}
.doorname{
  width: 100%;
  padding: 0.2em 0;
  margin: 0;
  cursor: pointer;
}
.doorlist{
  display: block;
  width: calc(100% - 10px);
  list-style: none;
  margin: 0;
  padding: 0
}
.doorname:nth-of-type(odd) {
  background: #ccc;
}
.doorname:hover {
  background: #ddd;
}
</style>
