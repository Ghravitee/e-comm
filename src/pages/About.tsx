// pages/About.tsx
import { Link } from "react-router-dom";
import { Container } from "../shared/components/Container";
import {
  CheckCircle,
  Truck,
  Shield,
  Award,
  Users,
  Leaf,
  ChevronRight,
} from "lucide-react";
import heroImage from "../assets/about-hero.webp";
import blurImage from "../assets/about-hero-blur.jpg";
import { useState } from "react";

const About = () => {
  const [loaded, setLoaded] = useState(false);
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description:
        "Every piece is carefully selected for durability, craftsmanship, and timeless design.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We're here to help you create the home you deserve.",
    },
    {
      icon: Leaf,
      title: "Sustainable Choices",
      description:
        "We partner with artisans who use eco-friendly materials and ethical production methods.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "Honest pricing, clear policies, and no hidden fees — always.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-150">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Blur placeholder */}
          <img
            src={blurImage}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />

          {/* Full image */}
          <img
            src={heroImage}
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Furniture hero background"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Overlay (optional for readability) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="absolute inset-0 left-10 flex items-center justify-start">
          <div className=" text-white space-y-4 px-4">
            <h1 className="text-5xl md:text-7xl tracking-wider font-semi-bold uppercase">
              About FSJ
            </h1>

            {/* Breadcrumb using Link */}
            <nav className="text-sm sm:text-base text-white/80 flex space-x-2 items-center">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <span>
                <ChevronRight className="w-4 h-4" />{" "}
              </span>
              <span>About FSJ</span>
            </nav>
          </div>
        </div>
      </section>

      <Container>
        {/* Our Story */}
        <div className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm tracking-wider uppercase mb-2 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                Crafting Spaces,{" "}
                <span className="font-medium">Creating Comfort</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in Lagos, FSJ was born from a simple idea: every
                  Nigerian home deserves beautiful, well-crafted furniture that
                  combines style with everyday functionality. What started as a
                  small showroom in Victoria Island has grown into a trusted
                  destination for discerning homeowners across the country.
                </p>
                <p>
                  We believe that your home should reflect your personality — a
                  space where comfort meets elegance, where every piece tells a
                  story. That's why we carefully curate each item in our
                  collection, partnering with skilled artisans and trusted
                  manufacturers who share our commitment to quality.
                </p>
                <p>
                  From modern minimalist designs to timeless classics, FSJ
                  offers a curated selection of furniture and decor that
                  transforms houses into homes. We're proud to serve customers
                  from Lagos to Abuja, Port Harcourt to Kano, delivering
                  excellence right to your doorstep.
                </p>
              </div>
            </div>
            <div className="relative h-100 rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop"
                alt="FSJ showroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-wider uppercase mb-2 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Our <span className="font-medium">Values</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop"
                  alt="Furniture piece"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop"
                  alt="Interior design"
                  className="rounded-lg w-full h-48 object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop"
                  alt="Living room setup"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop"
                  alt="Cozy bedroom"
                  className="rounded-lg w-full h-48 object-cover mt-8"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-primary text-sm tracking-wider uppercase mb-2 block">
                Why Choose FSJ
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                More Than Just <span className="font-medium">Furniture</span>
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Free Delivery Across Nigeria
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Complimentary shipping on orders over ₦150,000
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      30-Day Easy Returns
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Not satisfied? Return within 30 days, no questions asked
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Quality Guarantee
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Every piece is inspected for lasting durability
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/shop"
                className="inline-block mt-6 px-6 py-3 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
