import { Queue } from "queue-typescript";
import { TreeNode } from "./TreeNode";

export interface TreeProps {
    treeNodes: TreeNode[]
    setTreeNodes: (nodes: any[]) => void;
}

export enum NodeStatus {
    INACTIVE = "black",
    ACTIVE = "red",
}

export function generateTree(): TreeNode  {
    const head = new TreeNode(2)

    head.left = new TreeNode(1)
    head.right = new TreeNode(3)

    head.color = NodeStatus.INACTIVE;
    head.left.color = NodeStatus.INACTIVE;
    head.right.color = NodeStatus.INACTIVE;

    return head
}

export function addNode(head: TreeNode, value: number) {
    let curr: TreeNode | undefined = head;
    let prev: TreeNode | undefined = undefined;
    while(curr) {
        prev = curr;
        if(value <= curr.value) {
            curr = curr.left;
        } else {
            curr = curr.right;
        }
    }

    if(value <= prev!.value) {
        prev!.left = new TreeNode(value);
    }
    else {
        prev!.right = new TreeNode(value);
    }
}

export function calculateNodePositions(root: TreeNode | undefined, startX: number, levelY: number, levelGapY: number, minGapX: number): number {
    if (!root) return startX;

    const leftX = calculateNodePositions(root.left, startX, levelY + levelGapY, levelGapY, minGapX);
    const rightX = calculateNodePositions(root.right, leftX + minGapX, levelY + levelGapY, levelGapY, minGapX);

    const currentX = (leftX + rightX) / 2;
    root.position = { x: currentX, y: levelY };

    return rightX;
}

export interface TreeNodeElement {
    node: TreeNode,
}

export function convert(head: TreeNode, resetPosition?: boolean): TreeNode[] {
    const nodes: TreeNode[] = [];

    if(resetPosition) {
        const rootX = 200;
        const levelY = 100; 
        const levelGapY = 100; 
        const minGapX = 50; 

        calculateNodePositions(head, rootX, levelY, levelGapY, minGapX);
    }

    const q = new Queue<TreeNode>();
    q.enqueue(head);
    while (q.length !== 0) {
        const curr = q.dequeue();
        nodes.push(curr);
        if (curr.left) q.enqueue(curr.left);
        if (curr.right) q.enqueue(curr.right);
    }
    return nodes;
}

export function setInactive(head: TreeNode): TreeNode[] {
    const nodes = [];
    const q = new Queue<TreeNode>();
    q.enqueue(head);
    while (q.length !== 0) {
        const curr = q.dequeue();
        curr.color = NodeStatus.INACTIVE;
        nodes.push(curr);
        if (curr.left) q.enqueue(curr.left);
        if (curr.right) q.enqueue(curr.right);
    }
    return nodes;
}

export function convertArrayToTree(arr: number[]): TreeNode | undefined {
    arr.sort((a: number, b: number) => a - b);

    const buildTree = (l: number, r: number): TreeNode | undefined => {
        if(l > r) {
            return undefined;
        }
        let m = Math.floor((l + r) / 2);
        const root = new TreeNode(arr[m]);
        root.left = buildTree(l, m - 1);
        root.right = buildTree(m + 1, r);
        return root;
    }

    return buildTree(0, arr.length - 1);
}
