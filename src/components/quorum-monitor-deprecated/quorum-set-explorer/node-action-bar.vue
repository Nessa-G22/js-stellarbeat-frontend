<template>
        <b-dropdown right id="more" size="sm" text="More" class="p-0 m-0" toggle-class="more-button btn-thin" no-caret>
            <template slot="button-content">
                <i class="fe fe-more-vertical"></i>
            </template>
            <b-dropdown-header id="dropdown-header-label">
                Simulation options
            </b-dropdown-header>
            <b-dropdown-item v-on:click="$emit('node-toggle-validating', node)">
                <i class="dropdown-icon fe fe-activity"></i>
                {{node.isValidating ? 'Stop validating' : 'Try validating'}}
            </b-dropdown-item>
            <b-dropdown-item v-if="supportsDelete" v-on:click="$emit('node-delete', node)">
                <i class="dropdown-icon fe fe-minus-circle"></i>
                Remove
            </b-dropdown-item>
        </b-dropdown>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    import {Node} from "@stellarbeat/js-stellar-domain";

    @Component({
        name: "node-action-bar",
    })
    export default class NodeActionBar extends Vue {
        @Prop()
        public node!: Node;
        @Prop({default: false})
        public supportsDelete!: Boolean;
    }
</script>

<style scoped>

    .btn-group-xs > .btn, .btn-xs {
        padding: .25rem .25rem;
        font-size: .875rem;
        line-height: .5;
        border-radius: .2rem;
    }

    .btn-primary {
        background: #1997c6;
        border-color: #1997c6;
    }

    .btn-primary:hover {
        color: #fff;
        background-color: #1a85ad;
        border-color: #1a85ad;
    }
    .dropdown-header {
        padding: 0.5rem 1rem;
    }
    .hover-btn {
        position: absolute;
        right: 45px;
        border: none;
        outline: 0;
    }
</style>
