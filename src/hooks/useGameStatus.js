import {useState, useEffect, useCallback} from 'react';

export const useGameStatus = rowsCleared => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    // Scores taken from web
    const linePoints = [40, 100, 300, 1200];

    // Calculates the score
    const calculate_score = useCallback(() => {
        if(rowsCleared > 0){
            // Score formula from web
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]);

    useEffect(() => {
        calculate_score();
    }, [calculate_score, rowsCleared, score]);

    return [score, setScore, rows, setRows, level, setLevel];

}