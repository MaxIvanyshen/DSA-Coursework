import { useState } from "react";
import { bfs, binarySearch, dfs } from "./algos";
import {  TreeProps } from "./models/BinaryTree";

const AlgoBar: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
    const [value, setValue] = useState<number>();
    const triggerDFS = async () => {
        await dfs(treeNodes, setTreeNodes);
    }
    const triggerBFS = async () => {
        await bfs(treeNodes, setTreeNodes);
    }
    const triggerBS = async() => {
        await binarySearch(treeNodes, setTreeNodes, value);
    }

    const handleChange = (e: any) => {
        setValue(e.target.value);
    }
    return (
        <header>
            <div>
                <button onClick={triggerDFS}>DFS</button>
                <button onClick={triggerBFS}>BFS</button>
            </div>
            <div>
                <h3>Binary Search</h3>
                <input type='number' onChange={handleChange} value={value} name=''/>
                <button onClick={triggerBS}>Search</button>
            </div>
        </header>
    );
}

export default AlgoBar;

