import { useState, useEffect } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH, create_stage } from "../gameHelpers";

export const useStage = (player, reset_player) => {
    const [stage, setStage] = useState(create_stage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        // Clearing rows logic - if n rows are filled then add n empty rows
        // at the top by using unshift and return the accumulated array
        // If the row contains 0 then it shouldn't be cleared
        const clear_rows = newStage => 
            newStage.reduce((acc, row) => {
                if(row.findIndex(cell => cell[0] === 0) === -1){
                    setRowsCleared(prev => prev+1);
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return acc;
                }
                acc.push(row);
                return acc;
            }, [])

        const update_stage = (prevStage) => {

            // Flush the stage first
            const newStage = prevStage.map(row =>
                // Checks if the cell in the row is clear (empty)
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
            );

            // Draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        // Prevents out-of-bounds due to continuous down arrow key presses
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`,
                        ]
                    }
                });
            });

            if (player.collided) {
                reset_player();
                return clear_rows(newStage);
            }

            return newStage;
        };

        setStage(prev => update_stage(prev));
    }, [player, reset_player]);

    return [stage, setStage, rowsCleared];
}