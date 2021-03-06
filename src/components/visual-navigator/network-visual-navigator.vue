<template>
    <div class="card">
        <div class="sb-card-header d-flex flex-wrap-reverse mt-0 pt-3 pb-0 m-0">
            <div class="spacer h-100"></div>
            <ul class="sb-tab-nav">
                <li class="sb-tab-nav-item">
                    <router-link :to="{path: $route.path, query: {'view': 'map'}}"
                                 :class="['map', undefined].includes($route.query.view)  && 'router-link-exact-active'"
                                 class="sb-tab-nav-link"
                    >Map
                    </router-link>
                </li>
                <li class="sb-tab-nav-item">
                    <router-link :to="{path: $route.path,
                    query: {'view': 'graph'}}"
                                 :class="$route.query.view === 'graph' && 'router-link-exact-active'"                                 class="sb-tab-nav-link">Graph
                    </router-link>
                </li>
            </ul>
            <div class="pl-3 sb-bread-crumbs-container">
                <transition
                        name="fade"
                        mode="out-in"
                >
                    <b-breadcrumb class="sb-bread-crumbs" :items="breadCrumbs" :key="breadCrumbKey">
                    </b-breadcrumb>
                </transition>
            </div>
        </div>
        <div class="card-body py-3 px-3 border-top" style="height: 450px">
            <div v-if="network.graph.networkTransitiveQuorumSet.size === 0"
                 class="card-alert alert alert-danger" show>No transitive quorum set detected in network!
            </div>
            <world-map v-if="view==='map'"/>
            <network-graph-card v-if="view === 'graph'"/>
        </div>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import Store from '@/store/Store';
    import WorldMap from '@/components/visual-navigator/world-map.vue';
    import NetworkGraphCard from '@/components/visual-navigator/network-graph-card.vue';

    @Component({
        name: 'network-visual-navigator',
        components: {NetworkGraphCard, WorldMap}
    })
    export default class NetworkVisualNavigator extends Vue {
        @Prop({default: 'map'})
        public view!: string;

        get breadCrumbs() {
            //todo expand to orgs
            let crumbs = [];
            crumbs.push({
                text: 'Stellar Public Network',
                to: {name: 'network-dashboard', query: {view: this.$route.query.view}}
            });
            if (this.selectedNode)
                crumbs.push({
                    text: this.selectedNode.displayName,
                    active: true
                });
            if (this.selectedOrganization)
                crumbs.push({
                    text: this.selectedOrganization.name,
                    active: true
                });
            return crumbs;
        }

        get breadCrumbKey() {
            //todo expand to orgs
            if (this.selectedNode?.publicKey)
                return this.selectedNode?.publicKey;

            return 'stellar-public-network';
        }

        get store(): Store {
            return this.$root.$data.store;
        }

        get selectedNode() {
            return this.store.selectedNode;
        }

        get selectedOrganization() {
            return this.store.selectedOrganization;
        }

        get centerNode() {
            return this.store.centerNode;
        }

        get network() {
            return this.store.network;
        }
    }
</script>
<style scoped>
    .spacer {
        width: 10px;
        height: 100%;
        align-self: end;
    }

    .sb-bread-crumbs {
        background-color: white;
        margin: 0px;
        padding: 0px;
        align-self: center;
    }

    .sb-tab-nav {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
        position: relative;
        z-index: 1000;
        border-bottom: 0;
    }

    .sb-tab-nav-link.sb-tab-active {
        border-color: rgba(134, 140, 151, .34);
        color: #495057;
    }

    .sb-tab-nav .sb-tab-nav-link:hover {
        color: #495057;
    }

    .sb-tab-nav-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #868c97;
        background: rgba(53, 64, 82, .1);
        border: 1px solid rgba(134, 140, 151, .24);
        border-bottom: 0;
        padding: 5px 20px;
        border-radius: 0px;
    }

    .router-link-exact-active {
        border-bottom: 1px solid white !important;
        margin-bottom: -1px;
        background: #fff !important;
    }

    .sb-bread-crumbs-container {
        display: flex;
        flex-grow: 1;
    }
</style>