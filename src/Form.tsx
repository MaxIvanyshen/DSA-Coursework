import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { addNode, convert, TreeProps } from "./models/BinaryTree";

const MySwal = withReactContent(Swal);

const FormAlert: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
  const [nodeValue, setNodeValue] = useState<number>(0);

  const showAlertWithForm = () => {
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
        Swal.fire(
          'Node added!',
          `Value: ${result.value}`,
          'success'
        );
        addNode(treeNodes[0], result.value)
        if(setTreeNodes) {
            setTreeNodes(convert(treeNodes[0]));
        }
      }
    });
  };

  return (
    <div>
      <button onClick={showAlertWithForm}>Add Value</button>
    </div>
  );
};

export default FormAlert;
