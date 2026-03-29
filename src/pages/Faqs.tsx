// pages/Faqs.tsx
import { useState } from "react";
import { Container } from "../shared/components/Container";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Orders & Shipping",
      question: "How long does delivery take within Nigeria?",
      answer:
        "Delivery typically takes 3-7 business days depending on your location. Lagos and Abuja deliveries usually arrive within 3-5 days, while other states may take 5-7 business days. You'll receive a tracking number once your order ships.",
    },
    {
      category: "Orders & Shipping",
      question: "Do you ship to all states in Nigeria?",
      answer:
        "Yes! FSJ ships to all 36 states in Nigeria and the FCT. We partner with reliable logistics companies to ensure your items reach you safely, wherever you are.",
    },
    {
      category: "Orders & Shipping",
      question: "What are the shipping costs?",
      answer:
        "We offer FREE delivery on all orders above ₦150,000. For orders below that, shipping costs vary by location — you'll see the exact fee at checkout before completing your purchase.",
    },
    {
      category: "Returns & Refunds",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy from the date of delivery. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange. Items must be unused and in original packaging.",
    },
    {
      category: "Returns & Refunds",
      question: "How do I initiate a return?",
      answer:
        "Simply contact our customer service team via email at returns@fsj.com.ng or call us at +234 812 345 6789 within 30 days of receiving your order. We'll guide you through the process.",
    },
    {
      category: "Returns & Refunds",
      question: "When will I receive my refund?",
      answer:
        "Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The amount will be credited back to your original payment method.",
    },
    {
      category: "Products & Quality",
      question: "Are your products authentic?",
      answer:
        "Absolutely! We source all products directly from trusted manufacturers and artisans. Every piece is carefully inspected to ensure it meets our quality standards before being listed.",
    },
    {
      category: "Products & Quality",
      question: "Do you offer warranties on furniture?",
      answer:
        "Yes, we offer a 1-year warranty on all furniture items covering manufacturing defects. For electronics and appliances, warranties vary by brand — details are provided on each product page.",
    },
    {
      category: "Products & Quality",
      question: "Can I see products in person before buying?",
      answer:
        "Yes! Visit our showroom at 27, Adeola Odeku Street, Victoria Island, Lagos. Our friendly team would be happy to help you explore our collection in person.",
    },
    {
      category: "Payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major debit and credit cards, bank transfers, and cash on delivery. All online payments are securely processed through our trusted payment gateway.",
    },
    {
      category: "Payment",
      question: "Is cash on delivery available nationwide?",
      answer:
        "Yes, cash on delivery is available for orders across Nigeria. Our delivery partner will collect payment when your order arrives. Please have the exact amount ready.",
    },
    {
      category: "Account",
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status by logging into your FSJ account and visiting the 'My Orders' section.",
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs;

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-neutral-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide">
              Frequently Asked <span className="font-medium">Questions</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto px-4">
              Everything you need to know about shopping with FSJ
            </p>
          </div>
        </div>
      </div>

      <Container>
        <div className="py-16 md:py-24">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((category, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setSearchQuery(category)}
                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <span className="text-xs text-primary mb-1 block">
                            {faq.category}
                          </span>
                          <h3 className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                        </div>
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {openIndex === index && (
                        <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 p-8 bg-gray-50 rounded-xl text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-500 mb-6">
              We're here to help. Reach out to our support team.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Faqs;
