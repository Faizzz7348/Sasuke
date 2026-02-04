import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
}

const DEFAULT_SEO = {
  title: 'Sasuke - Route Management System',
  description: 'Efficient route and table management system for Selangor and Kuala Lumpur regions',
  keywords: ['route management', 'table management', 'selangor', 'kuala lumpur'],
  ogType: 'website',
}

export function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogImage,
  ogType = DEFAULT_SEO.ogType,
  canonicalUrl,
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords.join(', '))
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:type', ogType)
    
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage)
    }
    
    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage)
    }
    
    // Canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl)
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl])

  return null
}

function updateMetaTag(attr: string, value: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${value}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, value)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`)
  
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  
  element.setAttribute('href', href)
}
