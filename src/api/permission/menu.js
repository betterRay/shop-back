import request from '@/utils/request'
export default {
    getmenu() {
        return request.get('/admin/acl/permission')
    },
    //GET /admin/acl/permission
    //获取菜单列表

    updateMenu(data){
        return request.put('/admin/acl/permission/update',data)
    },
    //PUT /admin/acl/permission/update
    //更新菜单列表

    addMenu(data){
        return request.post('/admin/acl/permission/save',data)
    },
    //POST /admin/acl/permission/save
    //新增菜单

    deleteMenu(id){
        return request.delete(`/admin/acl/permission/remove/${id}`)
    },
    //DELETE /admin/acl/permission/remove/{id}
    //删除菜单
}