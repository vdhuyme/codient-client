import { SORT_FIELDS, SORT_ORDERS } from './constants'

export const DEFAULT_SORT = {
  sortBy: SORT_FIELDS.CREATED_AT,
  orderBy: SORT_ORDERS.DESC
}

export const convertSortingToParams = (sorting) => {
  if (!sorting?.length) {
    return DEFAULT_SORT
  }

  const { id, desc } = sorting[0]
  return {
    sortBy: id,
    orderBy: desc ? SORT_ORDERS.DESC : SORT_ORDERS.ASC
  }
}
