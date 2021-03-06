import {Node, Network} from '@stellarbeat/js-stellar-domain';
import {Change} from '@/services/change-queue/change-queue';

export class NetworkAddNode implements Change {
    _network: Network;
    _node: Node;

    constructor(network: Network, node: Node) {
        this._network = network;
        this._node = node;
    }

    execute(): void {
        this._network.nodes.push(this._node);
    }

    revert(): void {
        this._network.nodes.splice(
            this._network.nodes.indexOf(this._node),
            1
        );
    }
}