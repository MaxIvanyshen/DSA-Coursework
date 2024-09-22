import { Queue } from "queue-typescript";
import { TreeNode } from "./TreeNode";

export interface TreeProps {
    treeNodes: TreeNode[]
    setTreeNodes: (nodes: any[]) => void;
}

export function generateTree(): TreeNode  {
    const head = new TreeNode(3)

    head.left = new TreeNode(1)
    head.right = new TreeNode(2)

    head.left.left = new TreeNode(4)
    head.left.right = new TreeNode(5)

    head.right.left = new TreeNode(4)
    head.right.right = new TreeNode(5)

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

    // Calculate the position for the left and right children recursively
    const leftX = calculateNodePositions(root.left, startX, levelY + levelGapY, levelGapY, minGapX);
    const rightX = calculateNodePositions(root.right, leftX + minGapX, levelY + levelGapY, levelGapY, minGapX);

    // Set the current node's position (mid-point between the left and right children)
    const currentX = (leftX + rightX) / 2;
    root.position = { x: currentX, y: levelY };

    return rightX;
}

export function convert(head: TreeNode): TreeNode[] {
    const nodes: TreeNode[] = [];
    
    // Initialize starting coordinates and gaps
    const rootX = 600;  // Start the root roughly in the middle of the canvas
    const levelY = 100; // Start the root at this vertical position
    const levelGapY = 100; // Vertical gap between levels
    const minGapX = 50; // Minimum horizontal gap between sibling nodes

    // Call the recursive function to calculate positions for all nodes
    calculateNodePositions(head, rootX, levelY, levelGapY, minGapX);

    // Collect nodes using level-order traversal (to return them in order)
    const q = new Queue<TreeNode>();
    q.enqueue(head);
    while (q.length != 0) {
        const curr = q.dequeue();
        nodes.push(curr);
        if (curr.left) q.enqueue(curr.left);
        if (curr.right) q.enqueue(curr.right);
    }
    return nodes;
}
