import React from 'react'

export interface ConditionProps {
  Then?: React.ComponentType
  Else?: React.ComponentType
}

interface ConditionLayoutProps extends ConditionProps {
  condition: boolean
}

const ConditionLayout: React.FC<ConditionLayoutProps> = ({
  condition,
  Then,
  Else,
}) => {
  if (condition) {
    return Then ? <Then /> : null
  }

  return Else ? <Else /> : null
}

export default ConditionLayout
