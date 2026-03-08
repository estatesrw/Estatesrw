import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

// Simplified Africa map outline as dots, morphing to Rwanda
const AnimatedMapBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07] text-sidebar-foreground"
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <style>{`
        .dot-africa {
          fill: currentColor;
          animation: mapMorph 12s ease-in-out infinite;
        }
        @keyframes mapMorph {
          0%, 100% { opacity: 1; r: 2.5; }
          45% { opacity: 1; r: 2.5; }
          50% { opacity: 0; r: 0; }
          55% { opacity: 1; r: 3; }
          95% { opacity: 1; r: 3; }
        }
        .dot-rwanda {
          fill: currentColor;
          animation: mapMorphRw 12s ease-in-out infinite;
        }
        @keyframes mapMorphRw {
          0%, 100% { opacity: 0; r: 0; }
          45% { opacity: 0; r: 0; }
          50% { opacity: 1; r: 3.5; }
          55% { opacity: 1; r: 3.5; }
          95% { opacity: 1; r: 3.5; }
        }
        .dot-pulse {
          animation: dotPulse 3s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </defs>

    {/* Africa outline as dots - simplified continent shape */}
    {/* North Africa */}
    {[[300,80],[320,75],[340,70],[360,68],[380,70],[400,72],[420,78],[440,85],[460,80],[480,78],[500,82]].map(([cx,cy],i)=>(
      <circle key={`na${i}`} className="dot-africa" cx={cx} cy={cy} r="2.5" style={{animationDelay:`${i*0.08}s`}}/>
    ))}
    {/* West Africa */}
    {[[280,100],[270,120],[260,140],[250,160],[245,180],[250,200],[260,220],[255,240],[250,255],[260,265],[275,270]].map(([cx,cy],i)=>(
      <circle key={`wa${i}`} className="dot-africa" cx={cx} cy={cy} r="2.5" style={{animationDelay:`${i*0.08+0.2}s`}}/>
    ))}
    {/* East Africa */}
    {[[500,95],[510,110],[515,130],[520,150],[510,170],[505,190],[510,210],[520,230],[515,250],[505,270],[500,290]].map(([cx,cy],i)=>(
      <circle key={`ea${i}`} className="dot-africa" cx={cx} cy={cy} r="2.5" style={{animationDelay:`${i*0.08+0.4}s`}}/>
    ))}
    {/* Central/South */}
    {[[290,280],[310,300],[330,320],[350,340],[370,360],[390,370],[410,380],[420,400],[430,420],[440,440],[435,460],[420,475],[400,485],[380,490],[360,485],[350,470],[360,450],[370,430],[380,410],[390,390]].map(([cx,cy],i)=>(
      <circle key={`sa${i}`} className="dot-africa" cx={cx} cy={cy} r="2.5" style={{animationDelay:`${i*0.06+0.6}s`}}/>
    ))}
    {/* Interior fill dots */}
    {[[340,120],[380,140],[420,130],[350,170],[400,180],[450,160],[320,200],[370,210],[420,220],[470,200],[340,250],[390,260],[440,250],[350,300],[400,310],[450,300],[380,340],[420,350],[400,400],[410,440]].map(([cx,cy],i)=>(
      <circle key={`in${i}`} className="dot-africa dot-pulse" cx={cx} cy={cy} r="1.8" style={{animationDelay:`${i*0.1}s`}}/>
    ))}

    {/* Rwanda map as dots - centered, larger */}
    {/* Rwanda border outline */}
    {[[370,200],[380,190],[390,185],[400,183],[410,185],[420,188],[430,192],[435,200],[438,210],[435,220],[430,228],[425,235],[420,240],[410,242],[400,240],[390,238],[382,232],[375,225],[372,215],[370,208]].map(([cx,cy],i)=>(
      <circle key={`rw${i}`} className="dot-rwanda" cx={cx} cy={cy} r="3.5" style={{animationDelay:`${i*0.06}s`}}/>
    ))}
    {/* Rwanda interior */}
    {[[390,200],[400,195],[410,200],[395,210],[405,210],[415,210],[400,220],[410,220],[390,225],[405,230],[400,205],[415,220]].map(([cx,cy],i)=>(
      <circle key={`rwi${i}`} className="dot-rwanda dot-pulse" cx={cx} cy={cy} r="2.5" style={{animationDelay:`${i*0.08+0.3}s`}}/>
    ))}
    {/* Kigali marker - pulsing */}
    <circle cx="405" cy="212" r="5" className="dot-rwanda" style={{animation: "mapMorphRw 12s ease-in-out infinite, dotPulse 1.5s ease-in-out infinite"}} />
  </svg>
);

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Properties", href: "/dashboard/browse" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  };

  return (
    <footer className="relative bg-sidebar text-sidebar-foreground overflow-hidden">
      <AnimatedMapBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={logo} alt="EstatesRW Logo" className="h-14 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sidebar-foreground/70 mb-6 max-w-sm">
              Rwanda's premier property management platform. Find your perfect home, list your property, or discover professional services.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-sidebar-foreground/10 flex items-center justify-center hover:bg-sidebar-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Kigali, Rwanda
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +250 791 915 459
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@estatesrw.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-foreground/10 mt-12 pt-8 text-center text-sidebar-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} EstatesRW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
