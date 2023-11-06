import React from 'react';
import { StyledCell } from './styles/StyleCell';
import { TETROMINOS } from '../tetrominos';

function Cell({ type }) {
    return (
        <StyledCell type={type} color={TETROMINOS[type].color}></StyledCell>
    );
}

// Using React.memeo to re-render cells that only change
export default React.memo(Cell);