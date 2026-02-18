import React from 'react'
import { Helmet as HelmetVtex } from 'vtex.render-runtime'

type Tag = {
  type: 'script' | 'meta' | 'link' | 'style'
  tagProps: Record<string, unknown>
  tagContent: string
}

export interface HelmetProps {
  tags: Tag[]
}

function Helmet({ tags = [] }: HelmetProps) {

   
  const tagsElementList = tags.map((tag, index) => {
    if (tag.type === 'script') {
      return (
        <script
          type="text/javascript"
          {...tag.tagProps}
          key={`${tag.type}-${index}`}
        >
          {tag.tagContent}
        </script>
      )
    }

    if (tag.type === 'link') {
      return <link {...tag.tagProps} key={`${tag.type}-${index}`} />
    }

    if (tag.type === 'style') {
      return (
        <style {...tag.tagProps} key={`${tag.type}-${index}`}>
          {tag.tagContent}
        </style>
      )
    }

    return <meta key={`${tag.type}-${index}`} {...tag.tagProps} />
  })


  return <HelmetVtex>{tagsElementList}</HelmetVtex>
}

export default Helmet