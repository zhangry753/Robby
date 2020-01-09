const baseUrl = ''
const baseApiUrl = '/api'

const url = {
    // login
    userInfo: baseApiUrl + '/unify_admin/getLoginInfo',
    login: baseUrl + '/unify_admin/index?ext=/app/admin/vue/',
    logout: baseUrl + '/unify_admin/logout',
    oldSystem: baseUrl,
};
export default url;
