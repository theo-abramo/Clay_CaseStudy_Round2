import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Shield, Zap, Users, BarChart3, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

export default function FintechWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Corporate Cards",
      description: "Issue unlimited virtual and physical cards with custom spending controls and real-time visibility."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Expense Analytics",
      description: "AI-powered insights that help you identify spending patterns and optimize your budget."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fraud Protection",
      description: "Enterprise-grade security with real-time fraud detection and instant card freezing."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Reconciliation",
      description: "Automatic receipt matching and categorization that syncs with your accounting software."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Granular permissions and approval workflows that scale with your organization."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Reporting",
      description: "Live dashboards and customizable reports that give you complete financial visibility."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 corporate cards",
        "Basic expense tracking",
        "Monthly reports",
        "Email support",
        "Mobile app access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Growth",
      price: "149",
      description: "For growing companies scaling fast",
      features: [
        "Up to 50 corporate cards",
        "Advanced analytics & AI insights",
        "Real-time reporting",
        "Priority support",
        "API access",
        "Custom integrations",
        "Multi-entity support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited corporate cards",
        "Dedicated account manager",
        "Custom reporting & BI tools",
        "24/7 premium support",
        "Advanced fraud protection",
        "Custom API development",
        "SLA guarantees",
        "On-premise deployment options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const stats = [
    { value: "$2.4B+", label: "Processed Annually" },
    { value: "5,000+", label: "Companies Trust Us" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.8/5", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FlowFinance
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#features" className="block py-2 hover:text-purple-400">Features</a>
              <a href="#pricing" className="block py-2 hover:text-purple-400">Pricing</a>
              <a href="#about" className="block py-2 hover:text-purple-400">About</a>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm font-semibold">
                🚀 Trusted by 5,000+ companies worldwide
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Modern Spend Management
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Built for Scale
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empower your team with corporate cards, automated expense tracking, and real-time financial visibility. 
              All in one intelligent platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-purple-500/30 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-all">
                Book a Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-purple-500/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Manage Spending</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features that help finance teams work smarter, not harder
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, Transparent
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your company's needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border transition-all hover:transform hover:scale-105 cursor-pointer ${
                  plan.popular 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    {plan.price !== "Custom" && <span className="text-4xl font-bold">$</span>}
                    <span className="text-6xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400">
              Need a custom solution? <a href="#contact" className="text-purple-400 hover:text-purple-300">Contact our sales team</a>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Built by Finance Teams,
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> For Finance Teams</span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                We understand the challenges of managing corporate spending at scale. That's why we built FlowFinance - 
                a platform that combines the power of corporate cards, intelligent automation, and real-time analytics.
              </p>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of companies who have already transformed their spend management with FlowFinance.
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2">
                Learn Our Story
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-gray-400">Countries Supported</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold mb-2">50M+</div>
                <div className="text-gray-400">Transactions/Month</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold mb-2">$0</div>
                <div className="text-gray-400">Hidden Fees</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-gray-400">Support Team</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Spend Management?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies already using FlowFinance. Get started with a free 14-day trial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              Start Free Trial
            </button>
            <button className="border border-purple-500/30 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">FlowFinance</span>
              </div>
              <p className="text-gray-400">
                Modern spend management for growing companies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Features</a></li>
                <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400">API</a></li>
                <li><a href="#" className="hover:text-purple-400">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">About</a></li>
                <li><a href="#" className="hover:text-purple-400">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FlowFinance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}