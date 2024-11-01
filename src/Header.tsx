import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import NavDropdown from "react-bootstrap/esm/NavDropdown";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { bfs, binarySearch, dfs } from "./algos";
import { addNode, convert, convertArrayToTree, generateTree, setInactive, TreeProps } from "./models/BinaryTree";

const MySwal = withReactContent(Swal);

const Header: React.FC<TreeProps> = ({treeNodes, setTreeNodes}) => {
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

    const showBinarySearchForm = async () => {
        MySwal.fire({
            title: 'What value do you want to find?',
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                await binarySearch(treeNodes, setTreeNodes, result.value);
            }
        });

    };

    const reset = () => {
        setTreeNodes(convert(generateTree(), true));
    };

    const deactivate = () => {
        setTreeNodes(setInactive(treeNodes[0]));
    };

    const triggerDFS = async () => {
        await dfs(treeNodes, setTreeNodes);
    }
    const triggerBFS = async () => {
        await bfs(treeNodes, setTreeNodes);
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Binary Tree Visualization</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Algorithms" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={triggerDFS}>
                                DFS
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={triggerBFS}>
                                BFS
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={showBinarySearchForm}>
                                Binary Search
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Button className="ms-2" onClick={showAddNodeForm} variant="success">Add Value</Button>
                        <Button className="ms-2" onClick={setConvertArrayToTreeForm}>Build from array</Button>
                        <Button className="ms-2" onClick={deactivate}>Deactivate</Button>
                        <Button className="ms-2" onClick={reset} variant="danger">Reset</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
};

export default Header;
