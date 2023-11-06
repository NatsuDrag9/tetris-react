export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

// Create an array of size STAGE_HEIGHT where each row in the array
// contains another array of size STAGE_WIDTH filled with "clear"
// representing an empty row
export const create_stage = () =>
        Array.from(Array(STAGE_HEIGHT), () =>
                new Array(STAGE_WIDTH).fill([0, 'clear'])
        )

export const check_collision = (player, stage, { x: moveX, y: moveY }) => {
        for (let y = 0; y < player.tetromino.length; y += 1) {
                for (let x = 0; x < player.tetromino[y].length; x += 1) {
                        // Check that the cell is actually of a tetromino
                        if (player.tetromino[y][x] !== 0) {
                                // Checking for out-of-bounds
                                // Check that our move is inside the game area's height and width
                                // Check that the tetromino cell we're moving isn't set to 'clear'
                                if (!stage[y + player.pos.y + moveY] ||
                                        !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || stage[y + player.pos.y + moveY][x + player.pos.x +moveX][1] !== 'clear') {
                                                return true;
                                }
                                
                        }
                }
        }
};