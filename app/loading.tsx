import Spinner from "@/components/_shared/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner />
        </div>
    );
}