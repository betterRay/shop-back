import service from '@/utils/request'

export default {
    getTrademarkList(page, limit) {
        return service.get(`/admin/product/baseTrademark/${page}/${limit}`)
    },//获取商品列表
    addTrademark(info) {
        return service.post('/admin/product/baseTrademark/save',info)
    },//增加品牌
    editTrademark(info) {
        return service.put('/admin/product/baseTrademark/update',info)
    },//修改品牌内容
    deleteTrademark(id) {
        return service.delete(`/admin/product/baseTrademark/remove/${id}`)
    },//删除品牌内容
    getAllTrademarkList() {
        return service.get('/admin/product/baseTrademark/getTrademarkList')
    },
}
// GET /admin/product/baseTrademark/getTrademarkList