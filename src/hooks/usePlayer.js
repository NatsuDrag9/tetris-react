import { useCallback, useState } from 'react';
import { TETROMINOS, random_tetromino } from '../tetrominos';
import { STAGE_WIDTH, check_collision } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    // Rotates the tetromino
    const rotate = (matrix, direction) => {
        // Make the rows to become columns (transpose)
        const rotatedTetromino = matrix.map((_, index) => {
            return matrix.map(col => col[index]);
        });

        // Reverse each row to get the roated matrix
        // if rotation is clockwise
        if (direction > 0) {
            return rotatedTetromino.map(row => row.reverse());
        }
        // Else reverse the matrix if the rotation is
        // anticlockwise
        return rotatedTetromino.reverse();
    }

    // Player rotate
    const player_rotate = (stage, direction) => {
        // Make a copy of the player to prevent changing the contents
        // of the original player
        const playerCopy = JSON.parse(JSON.stringify(player));
        playerCopy.tetromino = rotate(playerCopy.tetromino, direction);

        // Checks for collision when rotating
        const pos = playerCopy.pos.x;
        let offset = 1;
        while (check_collision(playerCopy, stage, { x: 0, y: 0 })) {
            playerCopy.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            // Rotate the tetromino to its original direction if
            // looped through the complete length of the tetromino
            if (offset > playerCopy.tetromino[0].length) {
                rotate(playerCopy.tetromino, -direction);
                playerCopy.pos.x = pos;
                return;
            }
        }
        setPlayer(playerCopy);
    }
    
    // Updates the position of the player to the received 
    // parameters
    const update_player_pos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided
        }));
    }

    // Resets the player state. Callback doesn't depend on 
    // anything because the function is only called once
    const reset_player = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: random_tetromino().shape,
            collided: false
        })
    }, []);

    return [player, update_player_pos, reset_player, player_rotate];
}