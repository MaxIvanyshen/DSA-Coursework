import { bfs, dfs } from "./algos";
import {  TreeProps } from "./models/BinaryTree";

const AlgoBar: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
    const triggerDFS = async () => {
        await dfs(treeNodes, setTreeNodes);
    }
    const triggerBFS = async () => {
        await bfs(treeNodes, setTreeNodes);
    }
    return (
        <header>
            <button onClick={triggerDFS}>DFS</button>
            <button onClick={triggerBFS}>BFS</button>
        </header>
    );
}

export default AlgoBar;

