import React, { useState } from 'react';
import { create_stage, check_collision } from '../gameHelpers';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

// Custom hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

function Tetris() {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, update_player_pos, reset_player, player_rotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, reset_player);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    // Move the player if no collision occurs
    const move_player = (direction) => {
        if (!check_collision(player, stage, { x: direction, y: 0 })) {
            update_player_pos({ x: direction, y: 0 });
        }
    }

    // Starts the game or resets the game when game over
    const start_game = () => {
        setStage(create_stage());
        setDropTime(1000);
        reset_player();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    }

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if(rows > (level + 1) * 10){
            setLevel(prev => prev+1);
            // Increase speed of tetromino fall
            setDropTime(1000 / (level+1) + 200);
        }

        if (!check_collision(player, stage, { x: 0, y: 1 })) {
            update_player_pos({ x: 0, y: 1, collided: false });
        }
        else {
            // Game over when collision occurs at the top
            if (player.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            else {
                // Else the tetromino collided with the stage bounday
                // or/and other tetromino
                update_player_pos({ x: 0, y: 0, collided: true });
            }
        }
    }

    const drop_player = () => {
        drop();
    }

    // Processes key strokes from the key board
    const move = ({ keyCode }) => {
        if (!gameOver) {

            if (keyCode === 37) {
                // Left arrow
                // Moves the player to the left on x-axis
                move_player(-1);
            }
            else if (keyCode === 39) {
                // Right arrow
                // Moves the player to the right on x-axis
                move_player(1);
            }
            else if (keyCode === 40) {
                // Down arrow
                drop_player();
            }
            else if (keyCode === 38) {
                // Up arrow
                player_rotate(stage, 1);
            }
        }
    }

    const key_up = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level+1) + 200);
            }
        }
    }

    // Drops the tetromino at intervals dropTime
    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper 
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={key_up}
        >
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={start_game} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}

export default Tetris;