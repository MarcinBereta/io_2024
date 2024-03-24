import { ComparisonWrapper } from "@/components/contexts/ComparissionContext";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <ComparisonWrapper>
            <div
                className=" w-full flex flex-col gap-y-5 bg-bg overflow-auto relative"
                style={{ minHeight: "100%", backgroundColor: "#121217" }}>
                <div className="w-full flex "> {children}</div>
            </div>
        </ComparisonWrapper>
    );
};

export default ProtectedLayout;
