<template>
    <html>
        <div class="container-fluid">
     
      <div class="row border g-3">
        <div class="col border col-9 col-sm-8 ">
          <div class="row g-3 pe-sm-2 mb-0 d-none d-sm-block">
            <div class="box" style="height: 3.5vh; background-color: orangered;">[Deck Name] Deck Options</div>
          </div>
          <div class="row border g-3">
            <div class="col border col-6 col-sm-4">
              <div class="row border" style="height: 43.25vh;">
                <div class="box" style=" background-color: green;">Card image</div>
              </div>
              <div class="row border" style="height: 53.25vh;">
                <div class="box" style="background-color: orange;">Additional info/flavour text</div>
              </div>
      
            </div>

         


            <div class="border col-6 col-sm-8 ">
              <div class="box" style="height: 97.5vh; background-color: purple;">MY DECK</div>
            </div>
          </div>
        </div>
        <div class=" border col-4 d-none d-sm-block">
          <div class="row border ">
            <div class="box search" style="height: 30vh; ">
          <div class="form-floating">
            <input type="text" class="form-control" id="name" v-model="name" placeholder="Search" style="height: 25%;">
            <label class="form-label" for="name">Search by Name:</label>
          </div>



          </div>
          </div>
          <div class="row border ">
            <div class="box" style="height: 70vh; background-color: red; ">Search Results</div>
          </div>
        </div>
       <div class="col-3 d-sm-none">
        <div class="row">
        <div class="box" style="height: 15vh; background-color: indianred;"> *Mobile Search*
            <br />
            <input type="text" style="width:100%; height:25%;"/>
            <br />
            <button class="btn btn-dark">Search</button>
        </div>
        </div>
        <div class="row">
        <div class="box" style="height: 85vh; background-color: gold; ">*Mobile search results*</div>
        </div>

       </div>

        </div>

            </div>
    

</html>
  </template>

  <script>
import $ from 'jquery';

  export default{
    data() {
      return{ 
        name: ""
     
          
        }
      },
      mounted() {
        
   
      }}  
  </script>
  
  <style scoped>
 
  

  .box {
    background-color: blue;
    width: 100%;
    height: 100%;
  }
  html {
    overflow-y: hidden !important;
  }
.search{
  overflow-y: scroll;
  background-color: #3466af !important;
}

  </style>