import {resolveFormula} from './formula';
import {
  deepResolveFormulaSheet,
  mockResultSheet,
  mockSumSheetBuilder,
} from './mocks';
import {
  getCellAtPosition,
  getValueCellAtPosition,
  updateCellAtPosition,
} from './sheet';
describe('Sheet', () => {
  describe('getCellAtPosition', () => {
    it('should return a value for provided cell reference id', () => {
      const mockSheet = mockResultSheet;
      const resultCellA1 = getCellAtPosition('A1', mockSheet);
      const resultCellA2 = getCellAtPosition('A2', mockSheet);
      const resultCellC3 = getCellAtPosition('C3', mockSheet);

      expect(resultCellA1.value).toEqual({number: 5});
      expect(resultCellA2.value).toEqual({text: 'AA'});
      expect(resultCellC3.value).toEqual({text: 'CCC'});
    });
  });
  describe('updateCellAtPosition', () => {
    it('should update cell value at position in sheet', () => {
      const sheet = mockSumSheetBuilder().build();
      const updatedValue = {value: {number: 0}};
      updateCellAtPosition('A1', updatedValue, sheet);
      expect(getValueCellAtPosition('A1', sheet)?.value.number).toBe(0);
    });
  });
  describe('getValueCellAtPosition', () => {
    it('should return a value cell for given shallow reference', () => {
      const mockSheet = mockResultSheet;
      const resultCellA1 = getCellAtPosition('A1', mockSheet);
      const resultCellA2 = getCellAtPosition('A2', mockSheet);
      const resultCellC3 = getCellAtPosition('C3', mockSheet);

      expect(resultCellA1.value).toEqual({number: 5});
      expect(resultCellA2.value).toEqual({text: 'AA'});
      expect(resultCellC3.value).toEqual({text: 'CCC'});
    });
    it('should return a value cell for given formula cell', () => {
      const sheet = mockSumSheetBuilder().build();
      console.log(JSON.stringify(sheet, null, 4));
      expect(getValueCellAtPosition('C1', sheet)).toEqual({
        value: {number: 14},
      });
    });
    it('should update reference cell to value cell in sheet', () => {
      const sheet = mockSumSheetBuilder().build();
      const resultCell = getValueCellAtPosition('C1', sheet);
      expect(getCellAtPosition('C1', sheet)).toEqual(resultCell);
    });
  });
  describe('resolveFormula', () => {
    it('should resolve a deep formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      const formulaCell = {formula: {reference: 'B1'}};
      expect(resolveFormula(formulaCell.formula, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    it('should resolve a shallow formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      const formulaCell = {formula: {reference: 'H1'}};
      expect(resolveFormula(formulaCell.formula, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    describe('SUM', () => {
      it('should resolve a SUM formula where every reference is direct', () => {
        const sheet = mockSumSheetBuilder().build();
        const sumFormulaCell = {
          formula: {
            sum: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        expect(resolveFormula(sumFormulaCell.formula, sheet)).toEqual({
          value: {number: 10},
        });
      });
      it('should resolve a SUM formula with a cell where a reference is to a SUM formula', () => {
        const sheet = mockSumSheetBuilder().build();
        const sumFormulaCell = {
          formula: {
            sum: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(sumFormulaCell.formula, sheet);
        console.log(JSON.stringify(sheet, null, 4));
        expect(resultCell).toEqual({
          value: {number: 38},
        });
      });
      it('should have updated formula cells into value cells in the sheet', () => {
        const sheet = mockSumSheetBuilder().build();
        const sumFormulaCell = {
          formula: {
            sum: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(sumFormulaCell.formula, sheet);
        console.log(JSON.stringify(sheet, null, 4));
        const c1Cell = getCellAtPosition('C1', sheet);
        const d1Cell = getCellAtPosition('D1', sheet);
        console.log('c1Cell: ', JSON.stringify(c1Cell, null, 4));
        console.log('d1Cell: ', JSON.stringify(d1Cell, null, 4));
        expect(resultCell).toEqual({
          value: {number: 38},
        });
      });
    });
  });
});
