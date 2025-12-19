"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, User, Building2, Shield, CheckCircle, Loader2 } from "lucide-react"

const getThemeClasses = (tab) => {
  switch (tab) {
    case 'user':
      return {
        textGradient: 'bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent',
        text: 'text-green-600',
        buttonGradient: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        backButton: 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
      };
    case 'owner':
      return {
        textGradient: 'bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent',
        text: 'text-cyan-600',
        buttonGradient: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600',
        backButton: 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
      };
    case 'admin':
      return {
        textGradient: 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent',
        text: 'text-purple-600',
        buttonGradient: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        backButton: 'border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white'
      };
    default:
      return {
        textGradient: 'text-gray-600',
        text: 'text-gray-600',
        buttonGradient: 'bg-gray-500 hover:bg-gray-600',
        backButton: 'border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white'
      };
  }
};

export function SignupForm({ onBackToLogin, onActiveTabChange }) {
  const { register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("user")
  const [currentTitle, setCurrentTitle] = useState("Create Account")
  const [currentDescription, setCurrentDescription] = useState("Join LogiFlow and start managing your logistics operations")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // User specific
    companyName: "",
    companySize: "",
    industry: "",
    address: "",

    // Owner specific
    businessName: "",
    businessType: "",
    licenseNumber: "",
    yearsInBusiness: "",
    serviceAreas: "",
    fleetSize: "",
    description: "",

    // Admin specific (minimal for security)
    adminCode: "",
    department: "",

    // Terms
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState({})
  const theme = getThemeClasses(activeTab)

  useEffect(() => {
    switch (activeTab) {
      case "user":
        setCurrentTitle("Create User Account")
        setCurrentDescription("Join LogiFlow as a user and start managing your delivery orders")
        break
      case "owner":
        setCurrentTitle("Create Owner Account")
        setCurrentDescription("Register your delivery company and expand your business with LogiFlow")
        break
      case "admin":
        setCurrentTitle("Create Admin Account")
        setCurrentDescription("Administrative access to the LogiFlow platform")
        break
    }
    if (onActiveTabChange) {
      onActiveTabChange(activeTab)
    }
  }, [activeTab, onActiveTabChange])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Common validations
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

    // Role-specific validations
    if (activeTab === "user") {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
      if (!formData.industry) newErrors.industry = "Industry is required"
      if (!formData.address.trim()) newErrors.address = "Address is required"
    } else if (activeTab === "owner") {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
      if (!formData.businessType) newErrors.businessType = "Business type is required"
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required"
      if (!formData.serviceAreas.trim()) newErrors.serviceAreas = "Service areas are required"
    } else if (activeTab === "admin") {
      if (!formData.adminCode.trim()) newErrors.adminCode = "Admin code is required"
      if (!formData.department) newErrors.department = "Department is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const success = await register(formData, activeTab)
    if (!success) {
      setErrors({ submit: "Registration failed. Please try again." })
    }
  }

  const renderUserForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={formData.companyName}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          className={errors.companyName ? "border-red-500" : ""}
        />
        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry *</Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
            <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>
        <div>
          <Label htmlFor="companySize">Company Size</Label>
          <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1000+">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Business Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={errors.address ? "border-red-500" : ""}
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>
    </div>
  )

  const renderOwnerForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => handleInputChange("businessName", e.target.value)}
          className={errors.businessName ? "border-red-500" : ""}
        />
        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
            <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="courier">Courier Service</SelectItem>
              <SelectItem value="freight">Freight Company</SelectItem>
              <SelectItem value="logistics">Logistics Provider</SelectItem>
              <SelectItem value="delivery">Local Delivery</SelectItem>
              <SelectItem value="shipping">Shipping Company</SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
        </div>
        <div>
          <Label htmlFor="yearsInBusiness">Years in Business</Label>
          <Input
            id="yearsInBusiness"
            type="number"
            value={formData.yearsInBusiness}
            onChange={(e) => handleInputChange("yearsInBusiness", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licenseNumber">License Number *</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
            className={errors.licenseNumber ? "border-red-500" : ""}
          />
          {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
        </div>
        <div>
          <Label htmlFor="fleetSize">Fleet Size</Label>
          <Input
            id="fleetSize"
            type="number"
            value={formData.fleetSize}
            onChange={(e) => handleInputChange("fleetSize", e.target.value)}
            placeholder="Number of vehicles"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="serviceAreas">Service Areas *</Label>
        <Textarea
          id="serviceAreas"
          value={formData.serviceAreas}
          onChange={(e) => handleInputChange("serviceAreas", e.target.value)}
          className={errors.serviceAreas ? "border-red-500" : ""}
          placeholder="List cities, states, or regions you serve"
          rows={3}
        />
        {errors.serviceAreas && <p className="text-red-500 text-sm mt-1">{errors.serviceAreas}</p>}
      </div>

      <div>
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Brief description of your services and specialties"
          rows={3}
        />
      </div>
    </div>
  )

  const renderAdminForm = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <Shield className="w-4 h-4 inline mr-2" />
          Admin registration requires approval and a valid admin code.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="adminCode">Admin Code *</Label>
        <Input
          id="adminCode"
          type="password"
          value={formData.adminCode}
          onChange={(e) => handleInputChange("adminCode", e.target.value)}
          className={errors.adminCode ? "border-red-500" : ""}
          placeholder="Enter admin authorization code"
        />
        {errors.adminCode && <p className="text-red-500 text-sm mt-1">{errors.adminCode}</p>}
      </div>

      <div>
        <Label htmlFor="department">Department *</Label>
        <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
          <SelectTrigger className={errors.department ? "border-red-500" : ""}>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="customer-service">Customer Service</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="it">IT & Technology</SelectItem>
            <SelectItem value="management">Management</SelectItem>
          </SelectContent>
        </Select>
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="premium-card shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className={`text-3xl font-bold ${theme.textGradient}`}>Create Account</CardTitle>
          <CardDescription className={`text-lg ${theme.text}`}>
            Join LogiFlow and start managing your logistics operations
          </CardDescription>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Role-specific Forms */}
              <TabsContent value="user" className="mt-6">
                {renderUserForm()}
              </TabsContent>

              <TabsContent value="owner" className="mt-6">
                {renderOwnerForm()}
              </TabsContent>

              <TabsContent value="admin" className="mt-6">
                {renderAdminForm()}
              </TabsContent>

              {/* Terms and Conditions */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-cyan-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-cyan-600 hover:underline">
                      Privacy Policy
                    </a>{" "}
                    *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked)}
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm leading-relaxed">
                    I would like to receive marketing communications and updates about LogiFlow services
                  </Label>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBackToLogin}
                className={`flex-1 h-12 border-2 bg-transparent ${theme.backButton}`}
              >
                Back to Login
              </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 h-12 text-lg font-semibold shadow-xl ${theme.buttonGradient}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
