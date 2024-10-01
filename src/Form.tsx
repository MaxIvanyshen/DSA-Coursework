import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { addNode, convert, convertArrayToTree, generateTree, setInactive, TreeProps } from "./models/BinaryTree";

const MySwal = withReactContent(Swal);

const FormAlert: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
  const [nodeValue, setNodeValue] = useState<number>(0);
  const [arrStr, setArrStr] = useState<string>("");

  const showAddNodeForm = () => {
    MySwal.fire({
      title: 'Enter a number',
      input: 'number',
      inputValue: nodeValue,
      inputAttributes: {
        min: '0',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (value) => {
        if (value === '' || isNaN(Number(value))) {
          Swal.showValidationMessage('Please enter a valid number');
          return false;
        }
        return Number(value);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setNodeValue(result.value);
        addNode(treeNodes[0], result.value)
        if(setTreeNodes) {
            setTreeNodes(convert(treeNodes[0], true));
        }
      }
    });

  };

  const setConvertArrayToTreeForm = () => {
    MySwal.fire({
      title: 'Enter an array',
      input: 'text',
      inputValue: arrStr,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (value: string) => {
        if (value === '') {
          Swal.showValidationMessage('Please enter a valid array');
          return false;
        }
        const elements = value.split(",").map((x) => {
            return x.trim();
        });
        for(let i = 0; i < elements.length; i++) {
            if(!(/\d/.test(elements[i]))) {
                Swal.showValidationMessage('Please, enter an array of numbers');
                return false;
            }
        }
        return value;
      }
    }).then((result) => {
      if (result.isConfirmed) {
          const arr = result.value.split(",").map((x: string) => {
              return Number(x.trim());
          });
          setTreeNodes(convert(convertArrayToTree(arr)!, true));
      }
    });

  };

  const reset = () => {
      setTreeNodes(convert(generateTree(), true));
  };

  const deactivate = () => {
      setTreeNodes(setInactive(treeNodes[0]));
  };

  return (
    <div>
      <button onClick={showAddNodeForm}>Add Value</button>
      <button onClick={setConvertArrayToTreeForm}>Build from array</button>
      <button onClick={deactivate}>Deactivate</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default FormAlert;
