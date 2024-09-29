import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { TreeProps } from "./models/BinaryTree";

const Canvas: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null); // Track which circle is being dragged
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
      treeNodes.forEach((el) => {
        if(el.right) {
            ctx.beginPath();
            ctx.moveTo(el.position.x, el.position.y)
            ctx.lineTo(el.right.position.x, el.right.position.y);
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        if(el.left) {
            ctx.beginPath();
            ctx.moveTo(el.position.x, el.position.y)
            ctx.lineTo(el.left.position.x, el.left.position.y);
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

      });
      treeNodes.forEach((el) => {
          ctx.beginPath();
          ctx.arc(el.position.x, el.position.y, 20, 0, 2 * Math.PI);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 1;
          ctx.stroke()
          ctx.strokeText("" + el.value, el.position.x, el.position.y);
          ctx.textAlign = 'center';
      });

      ctx.restore(); // Restore the original state (without scaling)
    };

    draw();
  }, [treeNodes, scale]); // Re-render whenever positions or scale changesp

  // Handle mouse down event to start dragging a circle
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale; // Adjust for scaling
    const mouseY = (e.clientY - rect.top) / scale;  // Adjust for scaling

    // Check if the click is inside any of the circles
    for (let i = 0; i < treeNodes.length; i++) {
      const { x, y } = treeNodes[i].position;
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
        for(let i = 0; i < treeNodes.length; i++) {
            if(draggingCircle == i) {
                treeNodes[i].position = { x: mouseX - offset.x, y: mouseY - offset.y };
            }
            newNodes.push(treeNodes[i]);
        }
        setTreeNodes(newNodes);
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
