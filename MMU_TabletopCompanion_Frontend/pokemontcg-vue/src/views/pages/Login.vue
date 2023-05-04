<template>
    <div class="wrap">
    <div class="jumbotron jumbotron-fluid">
        <h1 class="display-1">Login</h1>
        <p class="lead">Enter your username and password below.</p>
        <form @submit.prevent="handleSubmit">
            <div class="form-floating">
            <input type="text" id="username" class="form-control"  v-model="username" placeholder="Enter Email here">
            <label for="username" class="form-label">Username:</label>
            <div class="validationtext" v-show="submitted && !username"><b>Username is required</b></div>
        </div>
        <br />
        <div class="form-floating">
            <input type="password" id="password" class="form-control" v-model="password" placeholder="Enter Password here">                 
           <label for="password" class="form-label">Password:</label>
           <div class="validationtext" v-show="submitted && !password"><b>Password is required</b></div>
           <br />
           <div class="alert alert-danger alert-dismissible" v-if="submitted && invalid" role="alert">
            Incorrect username or password, please try again.
            <button @click="removeAlert()" class="btn-close" data-dismiss="alert" aria-label="close alert"> </button>
        </div>
        </div>
        <br />
        <button class="btn btn-dark">Login</button>
    </form>
    <br />
</div>

<div class="container">
    <div class="row">
        <div class="col-auto">
        <p class="text">No account?</p>
        </div>
        <div class="col-md-2">
        <button class="btn btn-outline-warning">Create One</button>
    </div>
</div>
</div>

</div>
    </template>
     
    <script>
    import {userService} from "../../services/users.services"
    export default{
        data(){
            return{
                username: "",
                password: "",
                submitted: false,
                invalid: false
            }
        },
        methods: {
            handleSubmit(e){
                this.submitted = true
                const {username, password} = this
                userService.login(username, password)
                .then(result => {
                    this.$router.push("/");
                })
                .catch(error => {
                    if(error === 400){
                    this.invalid = true
                    }
                })
            },
            removeAlert(){
                this.invalid = false
            }
        }
    }
    </script>
    
    
    <style scoped>
    .jumbotron{
        background: url(../../assets/LoginPageJumbo.jpg);
    }
    .form-floating{
         width:40%;
         margin-left:2%;
    }
   .form-label{
    color:gray;
   }
   .btn-dark{
    margin-left:2%;
   }

   .lead{
    margin-left:1.7%;
   }
   .text{
   margin-top: 5%;
    color:white;
   }
   .container{
    margin-top: 1%;
   }
   .validationtext{
    color:red;
   }
    </style>