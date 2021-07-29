import request from '@/utils/request'
export default {
    getAllRole(page,limit,roleName) {
        return request.get(`/admin/acl/role/${page}/${limit}?roleName=${roleName}`)
    },
    //GET /admin/acl/role/{page}/{limit}
    //获取角色分页列表

    updateRole(role) {
        return request.put('/admin/acl/role/update',role)
    },
    //PUT /admin/acl/role/update
    //更新角色信息

    deleteRole(id) {
        return request.delete(`/admin/acl/role/remove/${id}`)
    },
    //DELETE /admin/acl/role/remove/{id}
    //删除角色

    addRole(role) {
        return request.post('/admin/acl/role/save',role)
    },
    //POST /admin/acl/role/save
    //增加角色

    batchRemoveRole(batch) {
        return request.delete('/admin/acl/role/batchRemove',batch)
    },
    //DELETE /admin/acl/role/batchRemove
    //批量删除角色
}