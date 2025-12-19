"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Shield, Menu, X, Star, Users, Clock, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { UserDashboard } from "@/components/user/user-dashboard"
import { OwnerDashboard } from "@/components/owner/owner-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { NotificationBell } from "@/components/notifications/notification-bell"

const getThemeClasses = (role) => {
  switch (role) {
    case 'user':
      return {
        logoBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        textGradient: 'bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent',
        text: 'text-green-600'
      };
    case 'owner':
      return {
        logoBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        textGradient: 'bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent',
        text: 'text-cyan-600'
      };
    case 'admin':
      return {
        logoBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        textGradient: 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent',
        text: 'text-purple-600'
      };
    default:
      return {
        logoBg: 'premium-gradient',
        textGradient: 'premium-text-gradient',
        text: 'text-gray-600'
      };
  }
};

export default function HomePage() {
  const { user, logout } = useAuth()
  const [selectedRole, setSelectedRole] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [signupActiveTab, setSignupActiveTab] = useState('user')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (selectedRole) {
      setCurrentRole(selectedRole)
      setSignupActiveTab(selectedRole)
    }
  }, [selectedRole])

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("animejs").then((mod) => {
        const animeCandidates = [mod?.default?.default, mod?.default, mod?.anime, mod]
        const anime = animeCandidates.find((c) => typeof c === "function")
        if (!anime) {
          console.error("animejs export not found or not a function", mod)
          return
        }
        const stagger = typeof anime.stagger === "function" ? anime.stagger : ((step, opts = {}) => (_el, i) => (opts.start || 0) + i * step)
        // Hero text animation without timeline (robust across CJS/ESM)
        const baseEasing = "easeOutExpo"
        const baseDuration = 1200
        anime({
          targets: ".hero-title",
          opacity: [0, 1],
          translateY: [80, 0],
          scale: [0.8, 1],
          easing: baseEasing,
          duration: baseDuration,
          delay: 400,
        })
        anime({
          targets: ".hero-subtitle",
          opacity: [0, 1],
          translateY: [50, 0],
          easing: baseEasing,
          duration: baseDuration,
          delay: 700,
        })
        anime({
          targets: ".hero-buttons",
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.9, 1],
          easing: baseEasing,
          duration: baseDuration,
          delay: 900,
        })

        // Enhanced feature cards animation with rotation
        anime({
          targets: ".feature-card",
          opacity: [0, 1],
          translateY: [60, 0],
          rotateX: [15, 0],
          delay: stagger(150, { start: 500 }),
          duration: 1000,
          easing: "easeOutCubic",
        })

        // Stats animation with bounce effect
        anime({
          targets: ".stat-number",
          innerHTML: [0, (el) => el.getAttribute("data-count")],
          duration: 2500,
          round: 1,
          easing: "easeOutBounce",
          delay: stagger(200, { start: 1200 }),
        })

        // Role cards entrance animation
        anime({
          targets: ".role-card",
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.95, 1],
          delay: stagger(200, { start: 800 }),
          duration: 800,
          easing: "easeOutQuart",
        })
      })
    }
  }, [user, selectedRole])

  if (user) {
    const headerTheme = getThemeClasses(user.role)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/20" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${headerTheme.logoBg} rounded-xl flex items-center justify-center shadow-lg floating-animation`}>
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${headerTheme.textGradient}`}>LogiFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <span className="text-sm text-gray-600 hidden md:block font-medium">
                Welcome, {user.name} ({user.role})
              </span>
              <Button
                variant="outline"
                onClick={logout}
                className="premium-button border-0 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="pt-24">
          {user.role === "user" && <UserDashboard />}
          {user.role === "owner" && <OwnerDashboard />}
          {user.role === "admin" && <AdminDashboard />}
        </main>
      </div>
    )
  }

  if (showSignup) {
    const signupTheme = getThemeClasses(signupActiveTab)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl fade-in-scale">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className={`w-12 h-12 ${signupTheme.logoBg} rounded-xl flex items-center justify-center shadow-xl floating-animation`}>
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h1 className={`text-4xl font-bold ${signupTheme.textGradient}`}>LogiFlow</h1>
            </div>
            <p className="text-gray-600 text-lg">Join the Future of Logistics Management</p>
          </div>

          <SignupForm onBackToLogin={() => { setSelectedRole(signupActiveTab); setShowSignup(false); }} onActiveTabChange={setSignupActiveTab} />
        </div>
      </div>
    )
  }

  if (selectedRole) {
    const roleTheme = getThemeClasses(currentRole)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md fade-in-scale">
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedRole(null)}
              className={`mb-6 backdrop-blur-sm border-0 text-white shadow-xl ${roleTheme.logoBg} hover:opacity-90`}
            >
              ← Back to role selection
            </Button>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className={`w-12 h-12 ${roleTheme.logoBg} rounded-xl flex items-center justify-center shadow-xl floating-animation`}>
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h1 className={`text-4xl font-bold ${roleTheme.textGradient}`}>LogiFlow</h1>
            </div>
            <p className="text-gray-600 text-lg">Logistics Management Platform</p>
          </div>

          <LoginForm
            onActiveTabChange={setCurrentRole}
            onShowSignup={() => setShowSignup(true)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/20" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg floating-animation">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold premium-text-gradient">LogiFlow</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium hover:scale-105"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium hover:scale-105"
              >
                About
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium hover:scale-105"
              >
                Features
              </a>
              <a
                href="#roles"
                className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium hover:scale-105"
              >
                Roles
              </a>
              <Button onClick={() => setSelectedRole("user")} className="premium-button shadow-lg">
                Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 backdrop-blur-sm bg-white/10 rounded-lg">
              <div className="flex flex-col space-y-4 pt-4 px-4">
                <a href="#home" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  Home
                </a>
                <a href="#about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  About
                </a>
                <a href="#features" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  Features
                </a>
                <a href="#roles" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  Roles
                </a>
                <Button onClick={() => setSelectedRole("user")} className="premium-button w-full">
                  Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/modern-logistics-warehouse.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-cyan-900/80 to-slate-900/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-6xl mx-auto mt-8 mb-8">
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 opacity-0 leading-tight">
              Streamlining Your
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mt-2">
                Logistics Experience
              </span>
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 max-w-4xl mx-auto opacity-0 text-gray-200 leading-relaxed px-4">
              Efficient, Transparent, and Tailored Solutions for Every Role
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 md:gap-6 justify-center opacity-0 px-4">
              <Button
                size="lg"
                className="premium-button text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 shadow-2xl"
                onClick={() => setShowSignup(true)}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="premium-card text-center p-8 pulse-glow">
              <div className="stat-number text-5xl font-bold premium-text-gradient mb-3" data-count="10000">
                0
              </div>
              <p className="text-gray-600 font-medium">Deliveries Completed</p>
            </div>
            <div className="premium-card text-center p-8 pulse-glow">
              <div className="stat-number text-5xl font-bold premium-text-gradient mb-3" data-count="500">
                0
              </div>
              <p className="text-gray-600 font-medium">Active Companies</p>
            </div>
            <div className="premium-card text-center p-8 pulse-glow">
              <div className="stat-number text-5xl font-bold premium-text-gradient mb-3" data-count="50">
                0
              </div>
              <p className="text-gray-600 font-medium">Cities Covered</p>
            </div>
            <div className="premium-card text-center p-8 pulse-glow">
              <div className="stat-number text-5xl font-bold premium-text-gradient mb-3" data-count="98">
                0
              </div>
              <p className="text-gray-600 font-medium">% Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About LogiFlow</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              LogiFlow is a comprehensive logistics management platform that connects businesses, delivery companies,
              and administrators in one seamless ecosystem. We're revolutionizing the way logistics operations are
              managed with transparency, efficiency, and innovation.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable</h3>
                <p className="text-gray-600">99.9% uptime with enterprise-grade infrastructure</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="text-gray-600">Real-time tracking and instant notifications</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Collaborative</h3>
                <p className="text-gray-600">Seamless communication between all stakeholders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your logistics operations efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-all duration-300 opacity-0">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600">Track your packages in real-time with GPS precision and instant updates</p>
            </div>

            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-all duration-300 opacity-0">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
              <p className="text-gray-600">Customized dashboards and permissions for users, owners, and admins</p>
            </div>

            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-all duration-300 opacity-0">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rating System</h3>
              <p className="text-gray-600">Rate and review delivery services to maintain quality standards</p>
            </div>

            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-all duration-300 opacity-0">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
              <p className="text-gray-600">Data-driven insights to optimize your logistics operations</p>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="py-24 bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 premium-text-gradient">Choose Your Role</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Select your role to access the appropriate dashboard and features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <Card
              className="role-card cursor-pointer premium-card opacity-0 group flex flex-col h-full"
              onClick={() => setSelectedRole("user")}
            >
              <CardHeader className="text-center pb-6 flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">User Portal</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  For companies and individuals who need delivery services
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col flex-grow">
                <ul className="text-gray-600 space-y-4 mb-8 flex-grow">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Publish delivery orders
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> View competitive pricing
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Track deliveries in real-time
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Rate delivery services
                  </li>
                </ul>
                <Button className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mt-auto">
                  Login as User
                </Button>
              </CardContent>
            </Card>

            <Card
              className="role-card cursor-pointer premium-card opacity-0 group flex flex-col h-full"
              onClick={() => setSelectedRole("owner")}
            >
              <CardHeader className="text-center pb-6 flex-shrink-0">
                <div className="w-20 h-20 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Owner Portal</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  For delivery companies and service providers
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col flex-grow">
                <ul className="text-gray-600 space-y-4 mb-8 flex-grow">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" /> View available orders
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" /> Submit competitive bids
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" /> Manage deliveries
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" /> Update delivery status
                  </li>
                </ul>
                <Button className="w-full h-14 premium-button text-lg font-semibold shadow-xl mt-auto">
                  Login as Owner
                </Button>
              </CardContent>
            </Card>

            <Card
              className="role-card cursor-pointer premium-card opacity-0 group flex flex-col h-full"
              onClick={() => setSelectedRole("admin")}
            >
              <CardHeader className="text-center pb-6 flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Admin Portal</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  For platform administrators and managers
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col flex-grow">
                <ul className="text-gray-600 space-y-4 mb-8 flex-grow">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" /> View all platform orders
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" /> Approve or reject orders
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" /> Manage user accounts
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" /> Platform analytics
                  </li>
                </ul>
                <Button className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mt-auto">
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  LogiFlow
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                Streamlining logistics operations with innovative technology and seamless user experiences.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#home" className="hover:text-cyan-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-cyan-400 transition-colors">
                    Roles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@logiflow.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Logistics Ave, Tech City</li>
                <li>🕒 24/7 Customer Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LogiFlow. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
