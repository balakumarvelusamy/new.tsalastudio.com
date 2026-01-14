export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin opacity-30" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            </div>
        </div>
    );
}
