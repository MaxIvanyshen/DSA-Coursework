
export class TreeNode {
    value: number = 0;
    left?: TreeNode = undefined;
    right?: TreeNode = undefined;
    position: {x: number, y: number} = {x: 0, y: 0};

    constructor(value: number, 
                left?: TreeNode | undefined, 
                right?: TreeNode | undefined,
                position?: {x: number, y: number}
               ) {
        this.value = value;
        this.left = left;
        this.right = right;
        if(position) {
            this.position = position;
        }
    }
}
