import {ColumnPosition} from '../enums';

export function parseCellPosition(cellPosition: string) {
  console.log(cellPosition);
  const positionStrSplit = cellPosition.split('');
  const parsedPosition = {
    row: ColumnPosition[positionStrSplit[0]] as number,
    column: parseInt(positionStrSplit[1]) - 1,
  };
  return parsedPosition;
}
