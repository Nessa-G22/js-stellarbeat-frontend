<template>
    <div>
        <transition
                name="fade"
                mode="out-in"
        >
            <div class="card pt-0" :key="selectedOrganization.id">
                <div class="card-header px-4 sb-card-header">
                    <shield-check v-if="selectedOrganization.isTierOneOrganization"
                                  v-b-tooltip.hover title="Tier One Organization" class="sb-card-title-icon"/>
                    <h3 class="card-title sb-card-title">
                        {{selectedOrganization.name}}</h3>
                </div>
                <div class="card-body px-4 pt-1">
                    <div class="sb-nav-bar">
                        <h6 class="sb-navbar-heading">Explore</h6>
                        <ul v-if="!store.isLoading" class="sb-nav-list">
                            <li class="sb-nav-item">
                                <organization-validators-dropdown :organization="selectedOrganization"
                                                                  :expand="true"/>
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
                                <b-form-checkbox v-model="store.includeWatcherNodes" name="include-watcher-nodes-button"
                                                 class="sb-nav-item sb-nav-toggle"
                                                 switch>
                                    Watcher nodes
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
    import Store from '@/store/Store';
    import StellarCoreConfigurationGenerator
        from '@stellarbeat/js-stellar-domain/lib/stellar-core-configuration-generator';
    import OrganizationValidatorsDropdown from '@/components/side-bar/organization/organization-validators-dropdown.vue';
    import NavLink from '@/components/side-bar/nav-link.vue';
    import SimulateNewNode from '@/components/node/simulation/simulate-new-node.vue';
    import ShieldCheck from '@/components/svg/shield-check.vue';

    @Component({
        components: {
            ShieldCheck,
            SimulateNewNode,
            NavLink,
            OrganizationValidatorsDropdown
        }
    })
    export default class OrganizationSideBar extends Vue {

        get store(): Store {
            return this.$root.$data.store;
        }

        get selectedOrganization() {
            return this.store.selectedOrganization;
        }

        get network() {
            return this.store.network;
        }

        get tomlNodesExport() {
            return '';
        }
    }
</script>
<style scoped>
</style>