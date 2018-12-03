declare function SSRecord<T>(sheetName: string, options?: {}): SheetTable<T>;
interface IOptions {
    sheetId?: string;
}
export declare class SheetTable<T> {
    name: string;
    options: IOptions;
    columns: string[];
    rowData: any[][];
    private sheet;
    private columnMap;
    constructor(sheetName: string, options: IOptions);
    data(): T[];
    findOne(attributes: {}): T | null;
    findAll(attributes: any): T[];
    create(attributes: T): void;
}
export default SSRecord;
