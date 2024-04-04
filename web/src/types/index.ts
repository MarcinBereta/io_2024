export type CSVValue = {
    value: string | number | Date | null;
    type: "normal" | "row_null" | "col_null" | "null";
};
export type CSVCol = {
    type: string;
    name: string;
    values: CSVValue[];
};

export type CSVFile = {
    name: string;
    id: string;
    cols: CSVCol[];
};

export type CSVColumnDetailed = {
    name: string;
    type: string;
    values: CSVValue[];
    details: {
        values: string | number | Date | null;
        name: string;
    }[];
    graphs: String[];
};

export type CSVUpdateColConst = {
    id: string;
    userId: string;
    value: string | number | Date;
};

export type CSVCompareDetailed = {
    details: {
        values: string | number | Date | null;
        name: string;
    }[];
    graphs: String[];
};
