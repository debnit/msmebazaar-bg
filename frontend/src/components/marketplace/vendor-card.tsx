"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Star,
  Users,
  Package,
  Clock,
  Phone,
  Mail,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Heart,
  Share2,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/utils/formatters"
import type { Vendor } from "@/types/marketplace"
import { useAnalytics } from "@/components/analytics-tracker"

interface VendorCardProps {
  vendor: Vendor
  variant?: "default" | "compact" | "featured"
  showActions?: boolean
  showStats?: boolean
  className?: string
  onContact?: (vendor: Vendor) => void
  onFollow?: (vendorId: string) => void
  onShare?: (vendor: Vendor) => void
}

interface VendorCardSkeletonProps {
  variant?: "default" | "compact" | "featured"
  className?: string
}

export function VendorCard({
  vendor,
  variant = "default",
  showActions = true,
  showStats = true,
  className,
  onContact,
  onFollow,
  onShare,
}: VendorCardProps) {
  const [isFollowing, setIsFollowing] = useState(vendor.isFollowing || false)
  const [isLoading, setIsLoading] = useState(false)
  const { trackClick, trackEvent } = useAnalytics()

  const handleFollow = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await onFollow?.(vendor.id)
      setIsFollowing(!isFollowing)

      trackEvent({
        type: "vendor_follow",
        properties: {
          vendorId: vendor.id,
          vendorName: vendor.businessName,
          action: isFollowing ? "unfollow" : "follow",
        },
      })
    } catch (error) {
      console.error("Failed to follow vendor:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContact = () => {
    onContact?.(vendor)
    trackClick({
      elementType: "button",
      elementText: "Contact Vendor",
      vendorId: vendor.id,
      vendorName: vendor.businessName,
    })
  }

  const handleShare = () => {
    onShare?.(vendor)
    trackClick({
      elementType: "button",
      elementText: "Share Vendor",
      vendorId: vendor.id,
      vendorName: vendor.businessName,
    })
  }

  const handleViewProfile = () => {
    trackClick({
      elementType: "link",
      elementText: "View Profile",
      vendorId: vendor.id,
      vendorName: vendor.businessName,
    })
  }

  if (variant === "compact") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={vendor.logo || "/placeholder.svg"} alt={vendor.businessName} />
              <AvatarFallback>{vendor.businessName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{vendor.businessName}</h3>
                {vendor.isVerified && <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{vendor.rating.toFixed(1)}</span>
                <span>({formatNumber(vendor.reviewCount)})</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">
                  {vendor.location.city}, {vendor.location.state}
                </span>
              </div>
            </div>

            {showActions && (
              <Button size="sm" variant="outline" onClick={handleViewProfile}>
                View
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className={cn("border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={vendor.logo || "/placeholder.svg"} alt={vendor.businessName} />
                <AvatarFallback className="text-lg">{vendor.businessName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{vendor.businessName}</h3>
                  {vendor.isVerified && <Shield className="h-5 w-5 text-green-600" />}
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{vendor.description}</p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({formatNumber(vendor.reviewCount)})</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {vendor.location.city}, {vendor.location.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {showActions && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleFollow} disabled={isLoading}>
                  <Heart className={cn("h-4 w-4 mr-1", isFollowing && "fill-red-500 text-red-500")} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {showStats && vendor.stats && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{formatNumber(vendor.stats.totalProducts)}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{formatNumber(vendor.stats.totalOrders)}</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{vendor.stats.responseTime}h</div>
                <div className="text-xs text-muted-foreground">Response</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleViewProfile} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button variant="outline" onClick={handleContact}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={vendor.logo || "/placeholder.svg"} alt={vendor.businessName} />
            <AvatarFallback>{vendor.businessName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">{vendor.businessName}</h3>
              {vendor.isVerified && <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{vendor.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({formatNumber(vendor.reviewCount)})</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {vendor.location.city}, {vendor.location.state}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={handleFollow} disabled={isLoading}>
                <Heart className={cn("h-4 w-4 mr-1", isFollowing && "fill-red-500 text-red-500")} />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {vendor.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {vendor.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{vendor.categories.length - 3} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        {showStats && vendor.stats && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{formatNumber(vendor.stats.totalProducts)}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{formatNumber(vendor.stats.totalOrders)}</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{vendor.stats.responseTime}h</div>
                <div className="text-xs text-muted-foreground">Response</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{vendor.stats.fulfillmentRate}%</div>
                <div className="text-xs text-muted-foreground">Fulfillment</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {vendor.contactInfo.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{vendor.contactInfo.phone}</span>
            </div>
          )}

          {vendor.contactInfo.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{vendor.contactInfo.email}</span>
            </div>
          )}

          {vendor.contactInfo.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="truncate">{vendor.contactInfo.website}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button onClick={handleViewProfile} className="flex-1">
              View Profile
            </Button>
            <Button variant="outline" onClick={handleContact}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function VendorCardSkeleton({ variant = "default", className }: VendorCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-18 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-12" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded flex-1" />
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export default VendorCard