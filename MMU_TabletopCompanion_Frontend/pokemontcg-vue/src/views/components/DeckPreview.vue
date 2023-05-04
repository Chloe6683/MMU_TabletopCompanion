<template>
        
    <div class="alert alert-info">
     <strong> {{ title }} </strong> {{ description }}
    </div>

</template>

<script>
export default {
    props: {
        title: String,
        description: String
    }
}
</script>