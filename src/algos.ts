import { convert, NodeStatus } from "./models/BinaryTree";
import { TreeNode } from "./models/TreeNode";

export async function dfs(treeNodes: TreeNode[], setTreeNodes: (nodes: any[]) => void) {
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
        console.log(el.value);
        setTreeNodes(convert(treeNodes[0]));
    }
    await traverse(curr);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
