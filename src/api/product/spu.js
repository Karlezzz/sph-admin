import request from '@/utils/brand-request'


export const reqSpuList = (page,limit,category3Id) =>request({
    url:`/admin/product/${page}/${limit}`,
    method:'get',
    params:{category3Id}
})