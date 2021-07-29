import request from '@/utils/request'
export default {
    getAllRole(page,limit,roleName) {
        return request.get(`/admin/acl/role/${page}/${limit}?roleName=${roleName}`)
    },
    //GET /admin/acl/role/{page}/{limit}
    //获取角色分页列表

}