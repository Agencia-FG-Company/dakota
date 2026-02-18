import React, { useEffect } from 'react'
import { Helmet as HelmetVtex } from 'vtex.render-runtime'

type Tag = {
  type: 'script' | 'meta' | 'link' | 'style'
  tagProps: Record<string, unknown>
  tagContent: string
}

export interface HelmetProps {
  tags: Tag[]
  initTrustvox?: boolean
}

function Helmet({ tags = [], initTrustvox = false }: HelmetProps) {

  useEffect(() => {
    if (!initTrustvox) return

    // Tenta inicializar o Trustvox após um delay para garantir que as DIVs estão no DOM
    const timer = setTimeout(() => {
      const tryInitialize = () => {
        if ((window as any)._trustvox_initializer) {
          (window as any)._trustvox_initializer.initialize()
          console.log('Trustvox inicializado com sucesso!')
          return true
        }
        return false
      }

      // Primeira tentativa imediata
      if (!tryInitialize()) {
        // Se não estiver pronto, tenta a cada 100ms por até 10 segundos
        const interval = setInterval(() => {
          if (tryInitialize()) {
            clearInterval(interval)
          }
        }, 100)

        // Limpa o intervalo após 10 segundos
        const timeoutId = setTimeout(() => clearInterval(interval), 10000)
        
        return () => {
          clearInterval(interval)
          clearTimeout(timeoutId)
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [initTrustvox])

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