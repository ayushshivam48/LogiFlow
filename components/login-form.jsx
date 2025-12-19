"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Mail, Lock, UserPlus, User, Building2, Shield } from "lucide-react"

export function LoginForm({ role, onActiveTabChange, onShowSignup }) {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(role || "user")
  const [currentTitle, setCurrentTitle] = useState("Login")
  const [currentDescription, setCurrentDescription] = useState("Access your delivery orders and manage shipments")
  const [formData, setFormData] = useState({
    user: { email: "", password: "" },
    owner: { email: "", password: "" },
    admin: { email: "", password: "" },
  })
  const [errors, setErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({
    user: false,
    owner: false,
    admin: false,
  })

  useEffect(() => {
    switch (activeTab) {
      case "user":
        setCurrentTitle("Login")
        setCurrentDescription("Access your delivery orders and manage shipments")
        break
      case "owner":
        setCurrentTitle("Delivery Company Login")
        setCurrentDescription("Manage your delivery services and view orders")
        break
      case "admin":
        setCurrentTitle("Admin Login")
        setCurrentDescription("Administrative access to the platform")
        break
    }
    if (onActiveTabChange) {
      onActiveTabChange(activeTab)
    }
  }, [activeTab, onActiveTabChange])

  const buttonClass = `w-full h-14 text-lg font-semibold shadow-xl text-white ${
    activeTab === "user"
      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      : activeTab === "owner"
      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
  }`

  const demoButtonClass = `border-0 text-sm px-4 py-2 text-white ${
    activeTab === "user"
      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      : activeTab === "owner"
      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
  }`

  const handleInputChange = (roleKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [roleKey]: { ...prev[roleKey], [field]: value },
    }))
    if (errors[roleKey]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [roleKey]: { ...prev[roleKey], [field]: "" },
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors((prev) => ({ ...prev, [activeTab]: {} }))

    const { email, password } = formData[activeTab]

    const newErrors = {}
    if (!email.trim()) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [activeTab]: newErrors }))
      return
    }

    console.log("Submitting login with role:", activeTab, "email:", email)
    const result = await login(email, password, activeTab)
    console.log("Login result:", result)
    if (!result.success) {
      console.log("Login failed:", result.error)
      setErrors((prev) => ({
        ...prev,
        [activeTab]: { submit: result.error.message },
      }))
    } else {
      console.log("User role:", result.user.role)
      // User state is set by login function, home page will show appropriate dashboard
      console.log("Login successful, user state updated")
    }
  }

  const getDemoCredentials = (roleKey) => {
    switch (roleKey) {
      case "user":
        return { email: "user@demo.com", password: "password" }
      case "owner":
        return { email: "owner@demo.com", password: "password" }
      case "admin":
        return { email: "admin@demo.com", password: "password" }
    }
  }

  const fillDemoCredentials = (roleKey) => {
    const demo = getDemoCredentials(roleKey)
    setFormData((prev) => ({
      ...prev,
      [roleKey]: demo,
    }))
  }

  return (
    <Card className="w-full max-w-md premium-card shadow-2xl border-0 slide-in-up">
      <CardHeader className="text-center pb-6">
        <CardTitle className={`text-3xl font-bold bg-clip-text text-transparent ${
          activeTab === "user"
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : activeTab === "owner"
            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
            : "bg-gradient-to-r from-purple-500 to-pink-500"
        }`}>{currentTitle}</CardTitle>
        <CardDescription className="text-gray-600 text-lg mt-2">{currentDescription}</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="user"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <User className="w-4 h-4" />
              User
            </TabsTrigger>
            <TabsTrigger
              value="owner"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Building2 className="w-4 h-4" />
              Owner
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Shield className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-6">
            <form action="" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="user-email" className="text-gray-700 font-semibold text-lg">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.user.email}
                    onChange={(e) => handleInputChange("user", "email", e.target.value)}
                    className="premium-input pl-12 h-14 text-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.user?.email && <p className="text-red-500 text-sm mt-1">{errors.user.email}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="user-password" className="text-gray-700 font-semibold text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="user-password"
                    type={showPasswords.user ? "text" : "password"}
                    value={formData.user.password}
                    onChange={(e) => handleInputChange("user", "password", e.target.value)}
                    className="premium-input pl-12 pr-12 h-14 text-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, user: !prev.user }))}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.user ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.user?.password && <p className="text-red-500 text-sm mt-1">{errors.user.password}</p>}
              </div>

              {errors.user?.submit && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertDescription className="text-red-700 font-medium">{errors.user.submit}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className={buttonClass}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-cyan-100/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Email: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("user").email}</span>
                    <br />
                    Password: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("user").password}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("user")}
                  className={demoButtonClass}
                >
                  Use Demo
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="owner" className="mt-6">
            <form action="" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="owner-email" className="text-gray-700 font-semibold text-lg">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="owner-email"
                    type="email"
                    value={formData.owner.email}
                    onChange={(e) => handleInputChange("owner", "email", e.target.value)}
                    className="premium-input pl-12 h-14 text-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.owner?.email && <p className="text-red-500 text-sm mt-1">{errors.owner.email}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="owner-password" className="text-gray-700 font-semibold text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="owner-password"
                    type={showPasswords.owner ? "text" : "password"}
                    value={formData.owner.password}
                    onChange={(e) => handleInputChange("owner", "password", e.target.value)}
                    className="premium-input pl-12 pr-12 h-14 text-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, owner: !prev.owner }))}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.owner ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.owner?.password && <p className="text-red-500 text-sm mt-1">{errors.owner.password}</p>}
              </div>

              {errors.owner?.submit && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertDescription className="text-red-700 font-medium">{errors.owner.submit}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className={buttonClass}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-cyan-100/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Email: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("owner").email}</span>
                    <br />
                    Password: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("owner").password}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("owner")}
                  className={demoButtonClass}
                >
                  Use Demo
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <form action="" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="admin-email" className="text-gray-700 font-semibold text-lg">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    value={formData.admin.email}
                    onChange={(e) => handleInputChange("admin", "email", e.target.value)}
                    className="premium-input pl-12 h-14 text-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.admin?.email && <p className="text-red-500 text-sm mt-1">{errors.admin.email}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="admin-password" className="text-gray-700 font-semibold text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-password"
                    type={showPasswords.admin ? "text" : "password"}
                    value={formData.admin.password}
                    onChange={(e) => handleInputChange("admin", "password", e.target.value)}
                    className="premium-input pl-12 pr-12 h-14 text-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, admin: !prev.admin }))}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.admin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.admin?.password && <p className="text-red-500 text-sm mt-1">{errors.admin.password}</p>}
              </div>

              {errors.admin?.submit && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertDescription className="text-red-700 font-medium">{errors.admin.submit}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className={buttonClass}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-cyan-100/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Email: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("admin").email}</span>
                    <br />
                    Password: <span className="font-mono bg-white/60 px-2 py-1 rounded">{getDemoCredentials("admin").password}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("admin")}
                  className={demoButtonClass}
                >
                  Use Demo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <Button
            type="button"
            onClick={onShowSignup}
            className={`w-full h-12 font-semibold transition-all duration-300 text-white ${
              activeTab === "user"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                : activeTab === "owner"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
