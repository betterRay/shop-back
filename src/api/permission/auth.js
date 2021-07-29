import request from '@/utils/request'
export default {
    getAllUser(page,limit,username) {
        return request.get(`/admin/acl/user/${page}/${limit}?username=${username}`)
    },
    //GET /admin/acl/user/{page}/{limit}
    //获取分页角色

}
