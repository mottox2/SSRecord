function SSRecord<T>(sheetName, options= {}) {
   return new SheetTable<T>(sheetName, options);
}

interface IOptions {
  sheetId?: string;
}

const Utils = {
  row2Record(row: any[], columnMap: Object) {
    // tslint:disable-next-line
    let record = {};
    Object.keys(columnMap).map((columnName) => {
      const columnIndex = columnMap[columnName];
      record[columnName] = row[columnIndex];
    });
    return record;
  },
};

// tslint:disable-next-line
export class SheetTable<T> {
  public name: string;
  public options: IOptions;
  public columns: string[];
  public rowData: any[][];
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;
  private columnMap: Object;

  constructor(sheetName: string, options: IOptions) {
    this.name = sheetName;
    this.options = options;

    const sheet = options.sheetId ?
      SpreadsheetApp.openById(options.sheetId).getSheetByName(this.name) :
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.name);

    this.sheet = sheet;
    const dataRange = sheet.getDataRange();
    const [columns, ...rowData] = dataRange.getValues();
    this.columns = (columns as string[]);
    this.rowData = rowData;

    this.columnMap = {};
    this.columns.map((column: string, index: number) => {
      this.columnMap[column] = index;
    });
  }

  public data(): T[] {
    const results = [];
    this.rowData.forEach((row) => {
      const record = Utils.row2Record(row, this.columnMap);
      results.push(record);
    });
    return results;
  }

  public findOne(attributes): (T | null) {
    // FIXME: delete return
    let result = null;
    this.rowData.forEach((row) => {
      let isMatched = true;
      Object.keys(attributes).forEach((columnName: string) => {
        const columnIndex = this.columnMap[columnName];

        if (row[columnIndex] !== attributes[columnName]) {
          isMatched = false;
        }
      });

      if (isMatched) {
        result = Utils.row2Record(row, this.columnMap);
      }
    });

    return result;
  }

  public findAll(attributes): T[] {
    const result = [];
    this.rowData.forEach((row) => {
      let isMatched = true;
      Object.keys(attributes).forEach((columnName: string) => {
        const columnIndex = this.columnMap[columnName];

        if (row[columnIndex] !== attributes[columnName]) {
          isMatched = false;
        }
      });

      if (isMatched) {
        result.push(Utils.row2Record(row, this.columnMap));
      }
    });

    return result;
  }

  public create(attributes: T) {
    const record = new Array(this.columns.length);

    Object.keys(attributes).forEach((columnName: string) => {
      const columnIndex = this.columnMap[columnName];
      record[columnIndex] = attributes[columnName];
    });

    const newRowIndex = (1 + this.rowData.length) + 1;
    // NOTE: Add utility functions
    this.sheet.getRange(newRowIndex, 0, 1, this.columns.length).setValues([record]);
  }

  // public initialize() {
  //   return new SheetRecord<T>();
  // }
}

// tslint:disable-next-line
class SheetRecord<T> {
  // public [K in keyof; public T; ] public any;
}

export default SSRecord;
