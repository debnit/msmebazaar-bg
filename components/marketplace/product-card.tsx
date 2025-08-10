"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye, Share2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatBusinessName } from "@/utils/formatters"
import type { Product } from "@/types/marketplace"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  showVendor?: boolean
  showQuickActions?: boolean
  className?: string
}

export default function ProductCard({
  product,
  variant = "default",
  showVendor = true,
  showQuickActions = true,
  className = "",
}: ProductCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Add to cart API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      })
      return
    }

    try {
      // Toggle wishlist API call would go here
      setIsWishlisted(!isWishlisted)

      toast({
        title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: `/products/${product.slug}`,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`)
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard",
      })
    }
  }

  const getStockBadge = () => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stock <= product.minStock) {
      return <Badge variant="warning">Low Stock</Badge>
    }
    return null
  }

  const getRatingStars = () => {
    const stars = []
    const fullStars = Math.floor(product.rating)
    const hasHalfStar = product.rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(product.rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />)
    }

    return stars
  }

  if (variant === "compact") {
    return (
      <Link href={`/products/${product.slug}`} className={className}>
        <Card className="group hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={primaryImage?.url || "/placeholder.svg?height=64&width=64"}
                  alt={primaryImage?.alt || product.name}
                  fill
                  className="object-cover rounded"
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0">-{discountPercentage}%</Badge>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mt-1">
                  {getRatingStars()}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm">{formatCurrency(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.slug}`} className={className}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={primaryImage?.url || "/placeholder.svg?height=300&width=300"}
              alt={primaryImage?.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && <Badge className="bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>}
              {product.featured && <Badge className="bg-orange-500 hover:bg-orange-600">Featured</Badge>}
              {getStockBadge()}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Quick View */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Quick view modal would open here
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Vendor Info */}
          {showVendor && product.vendor && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 relative">
                <Image
                  src={product.vendor.logo || "/placeholder.svg?height=24&width=24"}
                  alt={product.vendor.displayName}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-xs text-gray-600">{formatBusinessName(product.vendor.displayName)}</span>
              {product.vendor.address && (
                <>
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{product.vendor.address.city}</span>
                </>
              )}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {getRatingStars()}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0 || isLoading}>
            {isLoading ? (
              "Adding..."
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

// Product Card Skeleton for loading states
export function ProductCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}

// Product Grid Component
interface ProductGridProps {
  products: Product[]
  loading?: boolean
  variant?: "default" | "compact"
  showVendor?: boolean
  showQuickActions?: boolean
  className?: string
}

export function ProductGrid({
  products,
  loading = false,
  variant = "default",
  showVendor = true,
  showQuickActions = true,
  className = "",
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showVendor={showVendor}
          showQuickActions={showQuickActions}
        />
      ))}
    </div>
  )
}
