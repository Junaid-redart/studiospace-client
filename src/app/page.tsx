import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioCategories from "@/components/home/StudioCategories";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";


export default function Home() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <FeaturedStudios />
      <StudioCategories />
      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
}