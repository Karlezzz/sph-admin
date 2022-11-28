import requset from '@/utils/brand-request'

export const reqCategory1List = ()=>requset({
    url:'/admin/product/getCategory1',
    method:'get'
})

export const reqCategory2List = (category1Id)=>requset({
    url:`/admin/product/getCategory2/${category1Id}`,
    method:'get'
})

export const reqCategory3List = (category2Id) =>requset({
    url:`/admin/product/getCategory3/${category2Id}`,
    method:'get'
})