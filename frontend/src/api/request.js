import axios from 'axios'

const service = axios.create({
    baseURL: "http://localhost:11434",
    timeout: 15000,
    responseType: 'stream'
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 添加请求头等前置处理
        //config.headers['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('token')
        return config
    },
    error => {
        // 请求错误处理
        console.log('Request Error:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        console.log(response)
        // 响应后处理
        if (response.status === 200) {
            let contentType = response.headers.get("content-type")
            if (contentType === 'application/x-ndjson') {
                console.log('contentType', contentType)
                return Promise.resolve(response.data)
            } else {
                return Promise.resolve(response.data)
            }
        } else {
            return Promise.reject(response.data)
        }
    },
    error => {
        console.log('Response Error:', error)
        return Promise.reject(error)
    }
)

export default service
