import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

const Disclaimer = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Disclaimer | EstatesRW</title>
      <meta name="description" content="Read the disclaimer for EstatesRW. Understand the limitations of liability and the nature of information provided on our real estate platform." />
      <link rel="canonical" href="https://estatesrw.lovable.app/disclaimer" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Disclaimer</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: March 2, 2026</p>

        <h2 className="font-display text-2xl text-foreground">General Information</h2>
        <p>The information provided on EstatesRW ("the website") is for general informational purposes only. All property listings, pricing, descriptions, images, and other information on this website are provided by property owners and third-party service providers. While we strive to ensure the accuracy and reliability of this information, EstatesRW makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.</p>

        <h2 className="font-display text-2xl text-foreground">No Professional Advice</h2>
        <p>The content on EstatesRW does not constitute professional real estate, legal, financial, or investment advice. Any reliance you place on information provided on this website is strictly at your own risk. We strongly recommend consulting with qualified professionals before making any property-related decisions, including but not limited to purchasing, renting, or investing in real estate.</p>

        <h2 className="font-display text-2xl text-foreground">Third-Party Content</h2>
        <p>EstatesRW may contain links to third-party websites, advertisements, or content that are not owned or controlled by EstatesRW. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that EstatesRW shall not be responsible or liable for any damage or loss caused by the use of any such content, goods, or services available on or through any third-party websites.</p>

        <h2 className="font-display text-2xl text-foreground">Advertising Disclaimer</h2>
        <p>This website displays advertisements served by Google AdSense and other third-party advertising networks. These advertisements are provided by external companies and do not represent endorsement or recommendation by EstatesRW. The advertising content is determined by the advertisers and advertising networks, not by EstatesRW. We are not responsible for the content of any advertisements displayed on this website.</p>

        <h2 className="font-display text-2xl text-foreground">Property Listings</h2>
        <p>Property listings on EstatesRW are submitted by property owners and landlords. EstatesRW does not independently verify the accuracy of listing information, including property conditions, legal status, or ownership details. Users are advised to conduct their own due diligence, including physical property inspections and legal verification, before entering into any rental or purchase agreements.</p>

        <h2 className="font-display text-2xl text-foreground">Limitation of Liability</h2>
        <p>In no event shall EstatesRW, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the website or any content available through the website.</p>

        <h2 className="font-display text-2xl text-foreground">Contact</h2>
        <p>If you have questions about this disclaimer, contact us at <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a>.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
