import { ComparisonWrapper } from "@/components/contexts/ComparissionContext";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <ComparisonWrapper>
            <div
                style={{ backgroundColor: "#121217" }}
                className=" w-full flex flex-col gap-y-5">
                <div className="w-full flex "> {children}</div>
            </div>
        </ComparisonWrapper>
    );
};

export default ProtectedLayout;
