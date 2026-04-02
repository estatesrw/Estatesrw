import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Animated floating houses */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-primary/10 pointer-events-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float-house ${4 + i * 0.7}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
            transform: `translate(${(mousePos.x - 0.5) * (10 + i * 5)}px, ${(mousePos.y - 0.5) * (10 + i * 5)}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <svg width={40 + i * 8} height={40 + i * 8} viewBox="0 0 24 24" fill="currentColor" opacity={0.3 + i * 0.1}>
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9h-3v-5h-6v5H6v-9l6-4.5z" />
          </svg>
        </div>
      ))}

      {/* Animated map pin bouncing */}
      <div className="absolute top-[15%] right-[20%] animate-bounce text-primary/20">
        <MapPin className="w-12 h-12" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Big 404 with gradient */}
        <div className="relative mb-6">
          <h1
            className="text-[10rem] sm:text-[12rem] font-display font-black leading-none bg-gradient-to-br from-primary via-primary/60 to-primary/20 bg-clip-text text-transparent select-none"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * -8}px, ${(mousePos.y - 0.5) * -8}px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            404
          </h1>
          {/* Shadow text */}
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[12rem] font-display font-black leading-none text-primary/5 select-none"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * 12}px, ${(mousePos.y - 0.5) * 12}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            404
          </h1>
        </div>

        {/* Animated line */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 rounded-full animate-pulse" />

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Property Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
          Looks like this address doesn't exist in our listings. 
          The page may have moved or the link might be outdated.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2 rounded-xl shadow-lg">
            <Link to="/">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
            <Link to="/dashboard/browse">
              <Search className="w-4 h-4" /> Browse Properties
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 rounded-xl"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>

        {/* Tried path */}
        <p className="mt-8 text-xs text-muted-foreground/60 font-mono">
          {location.pathname}
        </p>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes float-house {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
