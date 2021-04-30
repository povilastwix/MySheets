import {Operator} from '../enums';
import {
  Cell,
  Formula,
  FormulaCell,
  ReferenceCell,
  Sheet,
  ValueCell,
} from '../interfaces';
import {getCellAtPosition, getValueCellAtPosition} from '../sheet';

export function resolveFormula(
  formula: Formula,
  sheet: Sheet,
  acc = {} as ValueCell
): ValueCell {
  console.log('formula: ', formula);
  if ('reference' in formula) {
    // resolve ReferenceCell
    const resultCell = getCellAtPosition(formula.reference, sheet);
    if ('formula' in resultCell) {
      return resolveFormula(resultCell.formula as Formula, sheet, acc);
    } else {
      acc = resultCell as ValueCell;
      return acc;
    }
  } else {
    // resolve FormulaOperator
    if (Operator.SUM in formula) {
      if (formula.sum !== undefined) {
        acc = calculateSum(formula.sum as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.MULTIPLY in formula) {
      if (formula.multiply !== undefined) {
        acc = calculateMultiply(formula.multiply as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.DIVIDE in formula) {
      return {} as ValueCell;
    }
    if (Operator.IS_GREATER in formula) {
      return {} as ValueCell;
    }
    if (Operator.IS_EQUAL in formula) {
      return {} as ValueCell;
    }
    if (Operator.NOT in formula) {
      return {} as ValueCell;
    }
    if (Operator.AND in formula) {
      return {} as ValueCell;
    }
    if (Operator.OR in formula) {
      return {} as ValueCell;
    }
    if (Operator.IF in formula) {
      return {} as ValueCell;
    }
    if (Operator.CONCAT in formula) {
      return {} as ValueCell;
    }
  }
  return acc;
}

function calculateSum(cells: ReferenceCell[], sheet: Sheet) {
  let result = 0;
  cells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
    console.log('Cell Value: ', cellValue);
    if (cellValue !== undefined) {
      result += cellValue;
    }
  });
  return {value: {number: result}} as ValueCell;
}

function calculateMultiply(cells: ReferenceCell[], sheet: Sheet) {
  let result = 1;
  cells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
    if (cellValue !== undefined) {
      result *= cellValue;
    }
  });
  return {value: {number: result}} as ValueCell;
}
