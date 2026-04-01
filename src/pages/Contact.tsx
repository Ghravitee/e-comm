// pages/Contact.tsx
import React, { useState } from "react";
import { Container } from "../shared/components/Container";
import {
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import heroImage from "../assets/contact-hero.webp";
import blurImage from "../assets/contact-hero-blur.jpg";
import { Link } from "react-router-dom";

// Import images and their blur versions for the gallery section
import showroomImg from "../assets/showrom.webp";
import showroomBlur from "../assets/showrom-blur.jpg";
import customerServiceImg from "../assets/customer-service.webp";
import customerServiceBlur from "../assets/customer-service-blur.jpg";
import teamImg from "../assets/team.webp";
import teamBlur from "../assets/team-blur.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [showroomLoaded, setShowroomLoaded] = useState(false);
  const [customerServiceLoaded, setCustomerServiceLoaded] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you soon.", {
      duration: 4000,
      position: "top-right",
      icon: "📧",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: ["+234 812 345 6789", "+234 803 456 7890"],
      note: "Mon-Fri, 9am - 6pm",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["hello@fsj.com.ng", "support@fsj.com.ng"],
      note: "We respond within 24 hours",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: [
        "Monday - Friday: Within 24 hours",
        "Weekends: Within 48 hours",
      ],
      note: "We value your time",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: ["Available on our website", "Mon-Fri, 9am - 5pm"],
      note: "Instant support",
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@fsj_home",
      url: "https://instagram.com",
    },
    {
      icon: Twitter,
      name: "Twitter",
      handle: "@fsj_home",
      url: "https://twitter.com",
    },
    {
      icon: Facebook,
      name: "Facebook",
      handle: "FSJ Home",
      url: "https://facebook.com",
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
            onLoad={() => setHeroLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              heroLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Contact hero background"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="absolute inset-0 left-10 flex items-center justify-start">
          <div className=" text-white space-y-4 px-4">
            <h1 className="text-5xl md:text-7xl tracking-wider font-semi-bold uppercase">
              Contact us
            </h1>

            {/* Breadcrumb */}
            <nav className="text-sm sm:text-base text-white/80 flex space-x-2 items-center">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <span>
                <ChevronRight className="w-4 h-4" />{" "}
              </span>
              <span>Contact Us</span>
            </nav>
          </div>
        </div>
      </section>

      <Container>
        <div className="py-16 md:py-24">
          {/* Image Gallery Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Image 1 - Showroom */}
            <div className="relative group overflow-hidden rounded-xl shadow-lg h-64">
              {/* Blur placeholder */}
              <img
                src={showroomBlur}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
              />
              {/* Full image */}
              <img
                src={showroomImg}
                onLoad={() => setShowroomLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover duration-1000 group-hover:scale-110 transition-transform ${
                  showroomLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Our Showroom"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium">Our Showroom</p>
                <p className="text-white/80 text-sm">
                  Experience our collection in person
                </p>
              </div>
            </div>

            {/* Image 2 - Customer Service */}
            <div className="relative group overflow-hidden rounded-xl shadow-lg h-64">
              {/* Blur placeholder */}
              <img
                src={customerServiceBlur}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
              />
              {/* Full image */}
              <img
                src={customerServiceImg}
                onLoad={() => setCustomerServiceLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover  duration-1000 group-hover:scale-110 transition-transform ${
                  customerServiceLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Customer Service"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium">Dedicated Support</p>
                <p className="text-white/80 text-sm">We're here to help you</p>
              </div>
            </div>

            {/* Image 3 - Team */}
            <div className="relative group overflow-hidden rounded-xl shadow-lg h-64">
              {/* Blur placeholder */}
              <img
                src={teamBlur}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
              />
              {/* Full image */}
              <img
                src={teamImg}
                onLoad={() => setTeamLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover  duration-1000 group-hover:scale-110 transition-transform  ${
                  teamLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Our Team"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium">Expert Team</p>
                <p className="text-white/80 text-sm">
                  Knowledgeable and friendly
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Let's <span className="font-medium">Connect</span>
                </h2>
                <p className="text-gray-500 text-sm">
                  We're here to help. Choose your preferred way to reach us.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm">
                          {detail}
                        </p>
                      ))}
                      <p className="text-gray-400 text-xs mt-1">{info.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors group"
                    >
                      <social.icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
                <div className="mt-3 space-y-1">
                  {socialLinks.map((social) => (
                    <p key={social.name} className="text-xs text-gray-500">
                      {social.name}: {social.handle}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 p-6 md:p-8 rounded-xl"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Send us a Message
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  By submitting this form, you agree to our privacy policy.
                  We'll never share your information.
                </p>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-gray-900 mb-2">
                  Frequently Asked{" "}
                  <span className="font-medium">Questions</span>
                </h3>
                <p className="text-gray-500">
                  Find quick answers to common questions
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-4 rounded-lg hover:bg-white transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">
                    How long does delivery take?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Delivery typically takes 3-7 business days depending on your
                    location in Nigeria.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg hover:bg-white transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We accept card payments, bank transfers, and cash on
                    delivery.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg hover:bg-white transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Do you offer returns?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes, we have a 30-day return policy for unused items in
                    original packaging.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg hover:bg-white transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">
                    How can I track my order?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive a tracking number via email and SMS once your
                    order ships.
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <a
                  href="/faqs"
                  className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                  View all FAQs
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
