"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ComparisonContext = createContext<{
    compares: {
        [key: string]: string[];
    };
    addCompare: (fileId: string, compare: string) => void;
    removeCompare: (fileId: string, compare: string) => void;
    cleanCompare: () => void;
}>({
    compares: {},
    addCompare: (fileId: string, compare: string) => {},
    removeCompare: (fileId: string, compare: string) => {},
    cleanCompare: () => {},
});

const ComparisonWrapper = ({ children }: { children: React.ReactNode }) => {
    const [compares, setCompares] = useState<{
        [key: string]: string[];
    }>({});

    useEffect(() => {
        const compare = localStorage.getItem("compares");
        if (compare) {
            setCompares(JSON.parse(compare));
        }
    }, []);

    const addCompare = async (fileId: string, compare: string) => {
        const compared = { ...compares };
        if (compared[fileId]) {
            if (compared[fileId].length == 2) compared[fileId].shift();
            compared[fileId].push(compare);
        } else {
            compared[fileId] = [compare];
        }

        setCompares(compared);

        await localStorage.setItem("compares", JSON.stringify(compared));
    };

    const removeCompare = async (fileId: string, compare: string) => {
        const newCompare = {
            ...compares,
            [fileId]: compares[fileId].filter((comp) => comp !== compare),
        };

        setCompares(newCompare);
        await localStorage.setItem("compares", JSON.stringify(newCompare));
    };

    const cleanCompare = async () => {
        setCompares({});
        await localStorage.setItem("compares", JSON.stringify({}));
    };

    return (
        <ComparisonContext.Provider
            value={{
                compares,
                addCompare,
                removeCompare,
                cleanCompare,
            }}>
            {children}
        </ComparisonContext.Provider>
    );
};

const useCompareContext = () => {
    return useContext(ComparisonContext);
};

export { ComparisonContext, ComparisonWrapper, useCompareContext };
