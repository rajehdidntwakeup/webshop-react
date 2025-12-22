/**
 * AnimatedBackground component provides a decorative background with floating, blurred circles.
 * It uses CSS animations to create a pulsing effect.
 *
 * @component
 */
export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div
                className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style={{animationDelay: '1s'}}></div>
            <div
                className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style={{animationDelay: '2s'}}></div>
        </div>
    );
}
