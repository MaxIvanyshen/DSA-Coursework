import { useState } from 'react';
import './App.css';
import Canvas from './Canvas';
import Header from './Header';
import { convert, generateTree } from './models/BinaryTree';

function App() {
    let tree = generateTree();
    const [nodes, setNodes] = useState(convert(tree, true));
    return (
        <div>
            <Header treeNodes={nodes} setTreeNodes={setNodes}/> 
            <Canvas treeNodes={nodes} setTreeNodes={setNodes}/>
        </div>
    );
}

export default App;
