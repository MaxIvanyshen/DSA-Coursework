import { dfs } from "./algos";
import {  TreeProps } from "./models/BinaryTree";

const AlgoBar: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
    const triggerDFS = async () => {
        await dfs(treeNodes, setTreeNodes);
    }
    return (
        <header>
            <button onClick={triggerDFS}>DFS</button>
        </header>
    );
}

export default AlgoBar;

