<template>
    <div>
        <transition
                name="fade"
                mode="out-in"
        >
            <div class="card pt-0" >
                <div class="card-header px-4 pb-4 sb-card-header">
                    <h3 class="card-title sb-card-title"><i class="fe fe-share-2 sb-card-title-icon mr-1"/>
                        Stellar Public Network</h3>
                </div>
                <div class="card-body px-4 pt-1">
                    <div class="sb-nav-bar">
                        <h6 class="sb-navbar-heading">Explore transitive quorumset</h6>
                        <ul v-if="!store.isLoading" class="sb-nav-list">
                            <li class="sb-nav-item">
                                <organizations-dropdown :organizations="networkTransitiveQuorumSetOrganizations"
                                                        :expand="organizationsExpanded"/>
                            </li>
                            <li class="sb-nav-item">
                                <validators-dropdown :nodes="networkTransitiveQuorumSetNodes" :expand="validatorsExpanded"/>
                            </li>
                        </ul>
                        <h6 class="sb-navbar-heading mt-4">Tools</h6>
                        <ul class="sb-nav-list">
                            <li class="sb-nav-item">
                                <nav-link
                                        :title="'Export configuration'"
                                        v-b-modal.tomlExportModal
                                        :show-icon="true"
                                        icon="fe-save"
                                />
                            </li>
                            <li class="sb-nav-item">
                                <nav-link
                                        v-b-modal.simulate-node-modal
                                        :title="'Simulate new node'"
                                        :show-icon="true"
                                        icon="fe-plus-circle"
                                />
                                <simulate-new-node/>
                            </li>
                        </ul>

                        <h6 class="sb-navbar-heading mt-3">Options</h6>
                        <ul class="sb-nav-list">
                            <li class="sb-nav-item">
                                <b-form-checkbox v-model="includeWatcherNodes" name="include-watcher-nodes-button"
                                                 class="sb-nav-item sb-nav-toggle"
                                                 switch>
                                    Show watcher nodes
                                </b-form-checkbox>
                            </li>
                        </ul>
                        <b-modal lazy size="lg" id="tomlExportModal"
                                 title="Stellar Core Configuration" ok-only ok-title="Close"
                        >
                            <pre><code>{{tomlNodesExport}}</code></pre>
                        </b-modal>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import FullValidatorTitle from '@/components/node/full-validator-title.vue';
    import Store from '@/store/Store';
    import Graph from '@/components/visual-navigator/graph/graph.vue';
    import GraphLegend from '@/components/visual-navigator/graph/graph-legend.vue';
    import StellarCoreConfigurationGenerator
        from '@stellarbeat/js-stellar-domain/lib/stellar-core-configuration-generator';
    import SimulateNewNode from '@/components/quorum-monitor-deprecated/quorum-set-explorer/simulate-new-node.vue';
    import NodeList from '@/components/quorum-monitor-deprecated/quorum-set-explorer/node-list.vue';
    import ValidatorsDropdown from '@/components/side-bar/network/validators-dropdown.vue';
    import NavLink from '@/components/side-bar/nav-link.vue';
    import OrganizationsDropdown from '@/components/side-bar/network/organizations-dropdown.vue';

    @Component({
        components: {
            OrganizationsDropdown,
            NavLink, NodeList, SimulateNewNode, GraphLegend, Graph, FullValidatorTitle, ValidatorsDropdown
        }
    })
    export default class NetworkSideBar extends Vue {
        protected includeWatcherNodes: boolean = false;
        protected validatorsExpanded: boolean = false;
        protected organizationsExpanded: boolean = true;

        get store(): Store {
            return this.$root.$data.store;
        }

        get selectedNode() {
            return this.store.selectedNode;
        }

        get centerNode() {
            return this.store.centerNode;
        }

        get network() {
            return this.store.network;
        }

        //todo: move to domain
        get networkTransitiveQuorumSetNodes() {
            return Array.from(this.network.graph.networkTransitiveQuorumSet)
                .map(publicKey => this.network.getNodeByPublicKey(publicKey)!);
        }

        //todo: move to domain
        get networkTransitiveQuorumSetOrganizations() {
            return [...new Set(this.networkTransitiveQuorumSetNodes
                .filter(node => node && node.organizationId)
                .map(node => this.network.getOrganizationById(node!.organizationId!))
            )];
        }

        get tomlNodesExport() {
            let stellarCoreConfigurationGenerator = new StellarCoreConfigurationGenerator(this.network);
            return stellarCoreConfigurationGenerator.nodesToToml(this.networkTransitiveQuorumSetNodes);
        }
    }
</script>
<style scoped>

</style>