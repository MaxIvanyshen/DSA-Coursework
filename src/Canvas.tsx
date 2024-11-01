import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { NodeStatus, TreeProps } from "./models/BinaryTree";

const Canvas: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save(); 
      ctx.scale(scale, scale);

      treeNodes.forEach((el) => {
        if(el.right) {
            ctx.beginPath();
            ctx.moveTo(el.position.x, el.position.y)
            ctx.lineTo(el.right.position.x, el.right.position.y);
            if(el.color === el.right.color && el.color === NodeStatus.ACTIVE) {
                ctx.strokeStyle = NodeStatus.ACTIVE;
            } else {
                ctx.strokeStyle = NodeStatus.INACTIVE;
            }
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        if(el.left) {
            ctx.beginPath();
            ctx.moveTo(el.position.x, el.position.y)
            ctx.lineTo(el.left.position.x, el.left.position.y);
            if(el.color === el.left.color && el.color === NodeStatus.ACTIVE) {
                ctx.strokeStyle = NodeStatus.ACTIVE;
            } else {
                ctx.strokeStyle = NodeStatus.INACTIVE;
            }
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
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.strokeText("" + el.value, el.position.x, el.position.y);
      });

      ctx.restore();
    };

    draw();
  }, [treeNodes, scale]);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    for (let i = 0; i < treeNodes.length; i++) {
      const { x, y } = treeNodes[i].position;
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance < 20) {
        setIsDragging(true);
        setDraggingCircle(i); 
        setOffset({ x: mouseX - x, y: mouseY - y });
        return;
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && draggingCircle !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / scale;
      const mouseY = (e.clientY - rect.top) / scale;

      let newNodes = [];
      for(let i = 0; i < treeNodes.length; i++) {
          if(draggingCircle === i) {
              treeNodes[i].position = { x: mouseX - offset.x, y: mouseY - offset.y };
          }
          newNodes.push(treeNodes[i]);
      }
      setTreeNodes(newNodes);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingCircle(null);
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();

      const deltaScale = e.deltaY > 0 ? -0.1 : 0.1;

      setScale((prevScale) => Math.min(Math.max(prevScale + deltaScale, 0.5), 3));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
    }

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
