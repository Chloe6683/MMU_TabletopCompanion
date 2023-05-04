<template>
 <router-link class="card mb-5 text-decoration-none border" id="card"  :to="linkTo">
        <div class="row no-gutters">
            <div class="col-4 align-self-center" >
        <img class="card-img spin" v-bind:src="imgSrc"/>
    </div>
    <div class="col-md-8">
        <div class="card-body">
            <h5 class="card-title" >{{ title }}</h5>
            <em class="card-subtitle">{{ description }}</em>
        </div>
        </div>  
</div>
    </router-link>
</template>


<script>
export default{
    props:{
        imgSrc: String,
        title: String,
        description: String,
        linkTo: String,
    },
    methods:{

    },
    created() {
    
},
    updated(){}
}
</script>

<style scoped>
.card {
  background-color: #3466af;
  width: 60%;
  color: white;
  box-shadow: 5px 5px 10px #3d7dca;
  
  background: linear-gradient(to left, #3466af 50%, #ffcb05 50%);
  background-size: 201%;
  background-position: right;
  border-right-color:#3466af;

  transition: background-position 0.5s ease-out;
}
  .card:hover {
    background-position: left;
  }


  .spin {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1.3s;
  transform-style: preserve-3d;
}

.card:hover .spin{
    transition:1.3s;
    transform:rotateZ(320deg) scale(1.5);
}
</style>