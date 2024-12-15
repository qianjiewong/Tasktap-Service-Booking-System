// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Header from "./_components/Header";
import Hero from "./_components/HeroSection";
import CategoryList from "./_components/CategoryList";
import BusinessList from "./_components/BusinessList";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "./_components/Header";
import GuaranteeSection from "./_components/GuaranteeSection";
import ReviewCarousel from "./_components/CustomerReview";

export default async function Home() {
  const session = await getServerSession (authOptions);
  return (
    <div>
      <div>
        <div className="hero">
          <Hero/>
        </div>
          <CategoryList />
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 mt-20">Popular Business</h1>
          <BusinessList />
          <ReviewCarousel />
          <GuaranteeSection />
          {/* <User />
          {JSON.stringify(session)} */}
      </div>
    </div>
  );
}
