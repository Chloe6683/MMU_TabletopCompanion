<template>
 <div class="card homecard mb-5 text-decoration-none border bg-dark" id="card">
    
        <div class="card-body">
            <h5 class="card-title" >{{ title }}</h5>
            <em class="card-subtitle">{{ text }}</em>
            <br />
        </div>  
    </div>
</template>


<script>
export default{ 
    props: {
        title: String,
        text: String
    }
}
</script>


<style>

.homecard{
    margin-left: 1%;
    max-width: 70%;
    color: white;
    opacity: 0.75;
    transition: opacity 0.3s ease-in-out;
}
</style>