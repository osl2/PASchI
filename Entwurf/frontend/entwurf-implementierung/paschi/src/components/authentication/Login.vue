<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="3">
                <v-text-field variant="outlined" label="Benutzername">
    
                </v-text-field>
                <v-text-field variant="outlined" label="Passwort">
    
                </v-text-field>
                <v-btn block prepend-icon="fa-sign-in-alt" color="primary" @click="doSomething()">Login</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
export default {
    import {} 

    props: {

    },
    setup() {

        doSomething(){

        }

        return{

        }
    }
}
</script>

<style>

</style>