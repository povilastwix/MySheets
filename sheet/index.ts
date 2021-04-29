import {resolveFormula} from '../formula';
import {Cell, FormulaCell, Job, Sheet, ValueCell} from '../interfaces';
import {parseCellPosition} from '../utils';

export function getCellAtPosition(cellPosition: string, sheet: Sheet) {
  const position = parseCellPosition(cellPosition);
  return sheet[position.column][position.row] as Cell;
}

export function getValueCellAtPosition(cellPosition: string, sheet: Sheet) {
  const position = parseCellPosition(cellPosition);
  const cell = sheet[position.column][position.row];
  console.log('POSITION: ', position);
  console.log('CELL at ', cellPosition, ' : ', cell);
  if ('value' in cell) return cell as ValueCell;
  if ('formula' in cell) {
    console.log('REFERENCE: ,', cell);
    return resolveFormula(cell.formula as FormulaCell, sheet) as ValueCell;
  }
}

export function updateCellAtPosition(
  cellPosition: string,
  cellValue: ValueCell,
  sheet: Sheet
) {
  const position = parseCellPosition(cellPosition);
  sheet[position.column][position.row] = cellValue;
}

export function evaluateSheet(providedJob: Job) {
  const initialSheet = providedJob.data;

  let resultSheet = initialSheet;

  return resultSheet;
}

export function findFormulas(sheet: Sheet) {
  const rowCount = sheet.length;
  let formulaCells = [] as Cell[];
  // console.log(sheet[0]);
  // console.log('rowCount: ', rowCount);
  for (let i = 0; i < rowCount; i++) {
    formulaCells = [
      ...formulaCells,
      ...sheet[i].filter((cell: Cell) => cell.formula !== undefined),
    ];
  }
  return formulaCells as FormulaCell[];
}
