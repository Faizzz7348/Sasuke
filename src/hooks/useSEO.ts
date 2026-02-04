import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
}

const DEFAULT_SEO = {
  title: 'Sasuke - Route Management System',
  description: 'Efficient route and table management system for Selangor and Kuala Lumpur regions',
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

export function useSEO(props: SEOProps) {
  useEffect(() => {
    const title = props.title || DEFAULT_SEO.title
    document.title = title
    
    const description = props.description || DEFAULT_SEO.description
    updateMetaTag('name', 'description', description)
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
  }, [props.title, props.description])
}
