import { Queue } from "queue-typescript";
import { convert, NodeStatus, setInactive } from "./models/BinaryTree";
import { TreeNode } from "./models/TreeNode";

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function dfs(treeNodes: TreeNode[], setTreeNodes: (nodes: any[]) => void) {
    setTreeNodes(setInactive(treeNodes[0]));
    const curr = treeNodes[0];
    const traverse = async (el: TreeNode | undefined) => {
        if(!el) {
            return;
        }

        await traverse(el.left);
        setTreeNodes(convert(treeNodes[0]));
        await traverse(el.right);
        setTreeNodes(convert(treeNodes[0]));
        await sleep(700);
        el.color = NodeStatus.ACTIVE;
        setTreeNodes(convert(treeNodes[0]));
    }
    await traverse(curr);
}

export async function bfs(treeNodes: TreeNode[], setTreeNodes: (node: any[]) => void) {
    setTreeNodes(setInactive(treeNodes[0]));
    const q = new Queue<TreeNode>();
    q.enqueue(treeNodes[0]);
    while(q.length !== 0) {
        const curr = q.dequeue();
        await sleep(700);
        curr.color = NodeStatus.ACTIVE;
        setTreeNodes(convert(treeNodes[0]));
        if(curr.left) q.enqueue(curr.left);
        if(curr.right) q.enqueue(curr.right);
    }
}

export async function binarySearch(
    treeNodes: TreeNode[],
    setTreeNodes: (node: any[]) => void,
    value: number | undefined,
) {
    if(!value) {
        return;
    }
    const traverse = async(node: TreeNode | undefined): Promise<boolean> => {
        await sleep(700);
        if(!node) return false;
        setTreeNodes(setInactive(treeNodes[0]));
        node.color = NodeStatus.ACTIVE;
        setTreeNodes(convert(treeNodes[0]));
        if(value < node.value) {
            return await traverse(node.left);
        }
        else if(value > node.value) {
            return await traverse(node.right);
        }
        return true;
    }
    const found = await traverse(treeNodes[0]);
    if(!found) {
        setTreeNodes(setInactive(treeNodes[0]));
    }
}
