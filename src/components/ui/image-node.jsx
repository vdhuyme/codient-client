// ImageNode.js
import { DecoratorNode } from 'lexical'
import React from 'react'

function ImageComponent({ src, alt }) {
  return <img src={src} alt={alt || ''} style={{ maxWidth: '100%' }} />
}

export class ImageNode extends DecoratorNode {
  __src
  __alt

  constructor(src, alt) {
    super()
    this.__src = src
    this.__alt = alt
  }

  static getType() {
    return 'image'
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt)
  }

  createDOM() {
    const img = document.createElement('span')
    return img
  }

  updateDOM() {
    return false
  }

  decorate() {
    return <ImageComponent src={this.__src} alt={this.__alt} />
  }

  static importJSON(serializedNode) {
    const { src, alt } = serializedNode
    return new ImageNode(src, alt)
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      alt: this.__alt,
      version: 1
    }
  }
}

export function $createImageNode(src, alt) {
  return new ImageNode(src, alt)
}

export function $isImageNode(node) {
  return node instanceof ImageNode
}
