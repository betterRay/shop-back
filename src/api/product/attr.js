import service from '@/utils/request'

export default {
    getCategory1() {
        return service.get('/admin/product/getCategory1')
    },//获取属性分类1列表
    getCategory2(category1Id) {
        return service.get(`/admin/product/getCategory2/${category1Id}`)
    },//获取属性分类2列表
    getCategory3(category2Id) {
        return service.get(`/admin/product/getCategory3/${category2Id}`)
    },//获取属性分类3列表
    getAttrList(category1Id,category2Id,category3Id){
        return service.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },//获取属性列表
    addOrEditAttr(attr){
        return service.post('/admin/product/saveAttrInfo',attr)
    },//修改或新增属性
    deleteAttr(attrId){
        return service.delete(`/admin/product/deleteAttr/${attrId}`)
    }
}
// GET /admin/product/getCategory1
// getCategory1

// GET /admin/product/getCategory2/{category1Id}
// getCategory2

// GET /admin/product/getCategory3/{category2Id}
// getCategory3

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}

// POST /admin/product/saveAttrInfo
// DELETE /admin/product/deleteAttr/{attrId}