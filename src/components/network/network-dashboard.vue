<template>
    <div class="row row-cards">
        <div class="col-md-12 col-lg-4 col-xl-5">
            <NodesCountryDistribution/>
            <NodesVersions/>
            <ValidatorsServerLoad/>
        </div>
        <div class="col-xl-7 col-lg-8 col-md-12">
            <QuorumSetConnections/>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import NodesCountryDistribution from '@/components/network/cards/nodes-country-distribution.vue';
    import NodesVersions from '@/components/network/cards/nodes-versions.vue';
    import ValidatorsServerLoad from '@/components/network/cards/validator-load.vue';
    import QuorumSetConnections from '@/components/network/cards/quorum-set-connections/quorum-set-connections.vue';

    @Component({
        components: {QuorumSetConnections, ValidatorsServerLoad, NodesVersions, NodesCountryDistribution}
    })

    export default class NetworkDashboard extends Vue {
    }
</script>
<style scoped>

</style>