import React from 'react'
import { useQuery } from 'react-apollo'


import PRODUCTS_BY_CLUSTER from "../../queries/productsByCluster.gql"
type Props = {
	clusterId: string | number

	Else?: React.ComponentType
	Then?: React.ComponentType
	children?: React.ReactNode
}

type SelectedFacetInput = {
	key: string
	value: string
}

type ProductSearchData = {
	productSearch?: {
		products?: Array<{
			items?: Array<{
				sellers?: Array<{
					commertialOffer?: {
						AvailableQuantity?: number
					}
				}>
			}>
		}>
	}
}

type ProductSearchVars = {
	selectedFacets: SelectedFacetInput[]
	from: number
	to: number
}

const hasAvailableSku = (data: ProductSearchData | undefined) => {
	const firstProduct = data?.productSearch?.products?.[0]
	if (!firstProduct?.items?.length) return false

	return firstProduct.items.some((sku) =>
		(sku.sellers ?? []).some((seller) => {
			const qty = seller?.commertialOffer?.AvailableQuantity
			return typeof qty === 'number' && qty > 0
		})
	)
}

// @ts-ignore
const BuyTogetherAvailable: StorefrontFunctionComponent<Props> = ({
	clusterId,
	Else,
	Then,
	children,
}) => {
	const clusterIdValue = String(clusterId ?? '').trim()

	const { data, loading, error } = useQuery<ProductSearchData, ProductSearchVars>(
		PRODUCTS_BY_CLUSTER,
		{
			variables: {
				selectedFacets: [{ key: 'productClusterIds', value: clusterIdValue }],
				from: 0,
				to: 10,
			},
			skip: !clusterIdValue,
		}
	)
    console.log(data,'data')
	if (!clusterIdValue) return null
	if (loading) return null
	if (error) return Else ? <Else /> : null

	const available = hasAvailableSku(data)

	if (available) {
		if (Then) return <Then />
		return <>{children}</>
	}

	if (Else) return <Else />
	return null
}

BuyTogetherAvailable.schema = {
	title: 'Condition Layout (Buy Together Available)',
	description:
		'Renderiza conteúdo apenas quando o primeiro produto de um cluster possui algum SKU disponível em estoque.',
	type: 'object',
	properties: {
		clusterId: {
			title: 'Product cluster id',
			description: 'ID do cluster de produtos (productClusterIds).',
			type: 'string',
		},
	},
	required: ['clusterId'],
}

export default BuyTogetherAvailable

