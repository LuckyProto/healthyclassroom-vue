const user = {
    state: {
        username: '',
        sign: '',
        userIp: 0
    },
    mutations: {
        setUsernameSync(state, payload){
            state.username = payload.username
        },
        setSignSync(state, payload){
            state.sign = payload.sign
        },
        setUserIpSync(state, payload){
            state.userIp = payload.userIp
            console.log(state.userIp)
        }
    },
    actions: {
        setUsernameAsync(context, payload) {
            context.commit('setUsernameSync', payload)
        },
        setSignAsync(context, payload){
            context.commit('setSignSync', payload)
        },
        setUserIpAsync(context, payload){
            context.commit('setUserIpSync', payload)
        }
    }
}

export default user;
