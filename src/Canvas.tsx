import { Queue } from "queue-typescript";
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { generateTree } from "./models/BinaryTree";
import { TreeNode } from "./models/TreeNode";

function calculateNodePositions(root: TreeNode | undefined, startX: number, levelY: number, levelGapY: number, minGapX: number): number {
    if (!root) return startX;

    // Calculate the position for the left and right children recursively
    const leftX = calculateNodePositions(root.left, startX, levelY + levelGapY, levelGapY, minGapX);
    const rightX = calculateNodePositions(root.right, leftX + minGapX, levelY + levelGapY, levelGapY, minGapX);

    // Set the current node's position (mid-point between the left and right children)
    const currentX = (leftX + rightX) / 2;
    root.position = { x: currentX, y: levelY };

    return rightX;
}

function convert(head: TreeNode): TreeNode[] {
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

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null); // Track which circle is being dragged
  const head = generateTree();
  const [nodes, setNodes] = useState<TreeNode[]>(convert(head));
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1); // Scale factor

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.save(); // Save the current state
      ctx.scale(scale, scale); // Apply scale factor

      // Draw the circles
      nodes.forEach((node) => {
        if(node.right) {
            ctx.beginPath();
            ctx.moveTo(node.position.x, node.position.y)
            ctx.lineTo(node.right.position.x, node.right.position.y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        if(node.left) {
            ctx.beginPath();
            ctx.moveTo(node.position.x, node.position.y)
            ctx.lineTo(node.left.position.x, node.left.position.y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

      });
      nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.position.x, node.position.y, 20, 0, 2 * Math.PI);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1;
          ctx.stroke()
          ctx.strokeText("" + node.value, node.position.x, node.position.y);
          ctx.textAlign = 'center';
      });

      ctx.restore(); // Restore the original state (without scaling)
    };

    draw();
  }, [nodes, scale]); // Re-render whenever positions or scale changes

  // Handle mouse down event to start dragging a circle
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale; // Adjust for scaling
    const mouseY = (e.clientY - rect.top) / scale;  // Adjust for scaling

    // Check if the click is inside any of the circles
    for (let i = 0; i < nodes.length; i++) {
      const { x, y } = nodes[i].position;
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance < 20) {
        setIsDragging(true);
        setDraggingCircle(i); // Mark which circle is being dragged
        setOffset({ x: mouseX - x, y: mouseY - y });
        return;
      }
    }
  };

  // Handle mouse move event to move a circle
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && draggingCircle !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / scale; // Adjust for scaling
      const mouseY = (e.clientY - rect.top) / scale;  // Adjust for scaling

      // Update the position of the dragged circle
        let newNodes = [];
        for(let i = 0; i < nodes.length; i++) {
            if(draggingCircle == i) {
                nodes[i].position = { x: mouseX - offset.x, y: mouseY - offset.y };
            }
            newNodes.push(nodes[i]);
        }
        setNodes(newNodes);
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingCircle(null); // Stop dragging the circle
  };

  // Handle mouse wheel event for scaling (Ctrl + Wheel)
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault(); // Prevent the default zoom behavior

      // Adjust the scale based on the wheel direction
      const deltaScale = e.deltaY > 0 ? -0.1 : 0.1;

      // Update scale within a reasonable range (e.g., between 0.5 and 3)
      setScale((prevScale) => Math.min(Math.max(prevScale + deltaScale, 0.5), 3));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    // Attach wheel event listener for scaling
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ border: "1px solid black" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Canvas;
