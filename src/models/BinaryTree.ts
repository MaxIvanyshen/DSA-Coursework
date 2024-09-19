import { TreeNode } from "./TreeNode";

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
