<template>
    <div>
        <div>
            <div class="page-header">
                <h1 class="page-title">
                    Available nodes
                </h1>
                <crawl-time/>
            </div>
            <div class="card mb-2 p-1">
                <div class="card-header">
                    <div class="row header-row">
                        <div class="col-12 col-sm-6">
                            <div class="row">
                                <div class="col-sm-6">
                                    <label class="custom-switch mt-2">
                                        <input name="custom-switch-checkbox" class="custom-switch-input" type="checkbox"
                                               v-model="optionShowInactive">
                                        <span class="custom-switch-indicator"></span>
                                        <span class="custom-switch-description">Include inactive nodes</span>

                                    </label>
                                </div>
                                <div class="col-sm-6">
                                    <label class="custom-switch mt-2">

                                        <input name="custom-switch-checkbox" class="custom-switch-input" type="checkbox"
                                               v-model="optionShowWatchers">
                                        <span class="custom-switch-indicator"></span>
                                        <span class="custom-switch-description">Include watcher nodes</span>

                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <b-form-input class="form-control search mr-0" type="text" v-model="filter"
                                          id="searchInput"
                                          placeholder="Type public key, name, ... to search"/>

                        </div>
                    </div>

                </div>
                <div class="card-body">

                    <b-table striped hover responsive :items="nodes" :fields="fields" :sort-by.sync="sortBy"
                             :sort-desc.sync="sortDesc" :per-page="perPage" :current-page="currentPage"
                             :filter="filter" @filtered="onFiltered">
                        <template v-slot:cell(name)="data">
                            <span v-if="data.item.isFullValidator"
                                  class="badge sb-badge badge-success full-validator-badge pt-1 mr-1"
                                  v-b-tooltip.hover title="Full validator">
                                <i class="fe fe-shield"></i>
                            </span>
                            <router-link v-if="data.item.isValidator"
                                         :to="{ name: 'node-dashboard', params: { 'publicKey': data.item.publicKey }, query: { 'center': '1' , 'view': $route.query.view}}">
                                {{ data.item.name || " " | truncate(20)}}
                            </router-link>
                            <router-link v-else
                                         :to="{ name: 'node-details', params: { publicKey: data.item.publicKey }}">{{
                                data.item.name || " " | truncate(20)}}
                            </router-link>
                        </template>
                        <template v-slot:cell(organization)="data">
                            <router-link v-if="data.item.organizationId"
                                    :to="{ name: 'organization-dashboard', params: { 'organizationId': data.item.organizationId, 'view': $route.query.view }}">
                                {{ data.item.organization}}
                            </router-link>
                        </template>
                        <template v-slot:cell(type)="row">
                            {{row.item.type}}
                        </template>
                        <template v-slot:cell(version)="data">
                            {{data.value || " " | truncate(28)}}
                        </template>
                        <template v-slot:cell(actions)="row">
                            <b-button-group class="btn-group-sm">
                                <router-link v-if="row.item.isValidator" class="btn btn-secondary" role="button"
                                             :to="{ name: 'node-dashboard', params: { 'publicKey': row.item.publicKey }, query: { 'center': '1','view': $route.query.view}}">
                                    Dashboard
                                </router-link>
                            </b-button-group>
                        </template>
                    </b-table>
                    <b-row>
                        <b-col md="6" class="my-1">
                            <b-pagination :totalRows="totalRows" :per-page="perPage" v-model="currentPage"
                                          class="my-1"/>
                        </b-col>
                    </b-row>
                </div>

            </div>
            <div class="card mb-2">
                <div class="card-body">
                    <div class="text-wrap">
                        <h2 class="mt-0 mb-4">Index formula</h2>
                        <pre><code>
Index = (TypeIndex + ActiveIndex + ValidationIndex + VersionIndex + TrustIndex + AgeIndex)/6

TypeIndex = Full validator | Basic validator | Watcher node
ActiveIndex = Active percentage last 30 days
ValidationIndex = Validation percentage last 30 days
Version = How far away from the latest stable Stellar core version
Trust = How many active validators trust this node
Age = Time since discovery
                        </code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import {Network, Node} from "@stellarbeat/js-stellar-domain";
    import CrawlTime from '@/components/crawl-time.vue';

    @Component({
        name: "nodes-table",
        components: {CrawlTime},
        metaInfo: {
            title: "Nodes overview - Stellarbeat.io",
            meta: [
                {name: "description", content: "Search through all available nodes"},
            ],
        },
    })
    export default class Nodes extends Vue {
        public optionShowInactive: boolean = false;
        public optionShowWatchers: boolean = false;
        public sortBy: string = "index";
        public sortDesc: boolean = true;
        public perPage: number = 200;
        public currentPage: number = 1;
        public filter: string = "";
        public fields = [
            {key: "name", sortable: true},
            {key: "organization", sortable: true},
            {key: "type", label: "type", sortable: true},
            // { key: 'publicKey', label: 'Public key (first 20 characters)', sortable: true },
            {key: "active24Hour", label: "24H active", sortable: true},
            {key: "active30Days", label: "30D active", sortable: true},
            {key: "validating24Hour", label: "24H validating", sortable: true},
            {key: "validating30Days", label: "30D validating", sortable: true},
            {key: "overLoaded24Hour", label: "24H overloaded", sortable: true},
            {key: "index", label: "index", sortable: true},
            {key: "validating", sortable: true},
            {key: "version", sortable: true},
            {key: "country", sortable: true},
            {key: "ip", sortable: true},

            {key: "actions", label: ""},
        ];

        @Prop()
        public network!: Network;
        @Prop()
        public isLoading!: boolean;

        get nodes(): any[] {
            return this.network.nodes
                .filter((node) => node.active || this.optionShowInactive)
                .filter((node) => node.isValidator || this.optionShowWatchers)
                .map((node) => {
                    return {
                        name: node.displayName,
                        type: node.isFullValidator ? "Full validator" : node.isValidator ? "Validator" : "Watcher",
                        active24Hour: node.statistics.has24HourStats ? node.statistics.active24HoursPercentage + "%": 'NA',
                        active30Days: node.statistics.has30DayStats ? node.statistics.active30DaysPercentage + "%" : 'NA',
                        validating24Hour: node.statistics.has24HourStats ? node.statistics.validating24HoursPercentage + "%" : 'NA',
                        validating30Days: node.statistics.has30DayStats ? node.statistics.validating30DaysPercentage + "%" : 'NA',
                        overLoaded24Hour: node.statistics.has24HourStats ? node.statistics.overLoaded24HoursPercentage + "%" : 'NA',
                        ip: node.key,
                        publicKey: node.publicKey,
                        country: node.geoData.countryName,
                        version: node.versionStr,
                        isFullValidator: node.isFullValidator,
                        isValidator: node.isValidator,
                        index: node.index,
                        validating: node.isValidating,
                        organization: this.getOrganization(node),
                        organizationId: node.organizationId
                    };
                });
        }

        get totalRows(): number {
            return this.nodes.length;
        }

        getOrganization(node: Node): string {
            if (!node.organizationId) {
                return "-";
            }
            let organization = this.network.getOrganizationById(node.organizationId);
            if (organization) {
                return organization.name;
            } else {
                return "-";
            }
        }

        public onFiltered = (filteredItems: any[]) => {
            // Trigger pagination to update the number of buttons/pages due to filtering
            // this.totalRows = filteredItems.length;
            this.currentPage = 1;
        };
    }
</script>
<style scoped>
    .header-row {
        width: 100%
    }
</style>